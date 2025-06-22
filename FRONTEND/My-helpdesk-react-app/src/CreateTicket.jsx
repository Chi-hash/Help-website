import React, { useState, useRef } from 'react';
import { LeftHeader } from './LeftHeader'
import { TopHeader } from './TopHeader'
import { getAuthToken, getUserData, handleAuthError } from './utils/auth.js';
import { Paperclip, X, FileText, Image, File, Trash2, Send } from 'lucide-react';
import "./styles/createTicket.scss";

export const CreateTicket = () => {
    const [formData, setFormData] = useState({
        subject: '',
        description: ''
    });
    const [attachments, setAttachments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);

    // Get user data to check role
    const user = getUserData();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Maximum size is 5MB.`);
                return false;
            }

            // Check file type
            const allowedTypes = [
                'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
                'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain', 'application/zip', 'application/x-zip-compressed'
            ];

            if (!allowedTypes.includes(file.type)) {
                alert(`File type ${file.type} is not supported.`);
                return false;
            }

            return true;
        });

        // Create preview objects
        const newAttachments = validFiles.map(file => ({
            file,
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }));

        setAttachments(prev => [...prev, ...newAttachments]);

        // Clear the input
        e.target.value = '';
    };

    const removeAttachment = (id) => {
        setAttachments(prev => {
            const attachment = prev.find(att => att.id === id);
            if (attachment && attachment.preview) {
                URL.revokeObjectURL(attachment.preview);
            }
            return prev.filter(att => att.id !== id);
        });
    };

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return <Image size={20} />;
        if (type === 'application/pdf') return <FileText size={20} />;
        if (type.includes('word') || type.includes('document')) return <FileText size={20} />;
        if (type === 'text/plain') return <FileText size={20} />;
        if (type.includes('zip')) return <File size={20} />;
        return <File size={20} />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.subject.trim() || !formData.description.trim()) {
            setMessage('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const token = getAuthToken();
            if (!token) {
                setMessage('Please log in to create a ticket.');
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('subject', formData.subject);
            formDataToSend.append('description', formData.description);

            // Add attachments
            attachments.forEach(attachment => {
                formDataToSend.append('attachments', attachment.file);
            });

            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            if (handleAuthError(response)) {
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setMessage('Ticket created successfully!');
                // Reset form
                setFormData({ subject: '', description: '' });
                setAttachments([]);

                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = '/manage-tickets/my-tickets';
                }, 2000);
            } else {
                setMessage(data.message || 'Failed to create ticket.');
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            setMessage('An error occurred while creating the ticket.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="dashboardsection">
            <div className="left">
                <LeftHeader />
            </div>
            <div className="right">
                <TopHeader />
                <div className="ticketcreation">
                    <h1 className='createticketh1'>Create New Ticket</h1>

                    {message && (
                        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="ticket-form">
                        <div className="form-group">
                            <label htmlFor="subject">Subject: </label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder="Enter ticket subject"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description: </label>
                            <textarea
                                name="description"
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your issue in detail"
                                required
                                rows={6}
                            />
                        </div>

                        <div className="attachments-section">
                            <label>Attachments:</label>
                            <button
                                type="button"
                                className="attachment-btn"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Paperclip size={16} />
                                Add Files
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                        </div>

                        {/* Attachments Preview */}
                        {attachments.length > 0 && (
                            <div className="attachments-preview">
                                <h4>Attached Files ({attachments.length})</h4>
                                <div className="attachments-grid">
                                    {attachments.map(attachment => (
                                        <div key={attachment.id} className="attachment-item">
                                            {attachment.preview ? (
                                                <div className="image-preview">
                                                    <img src={attachment.preview} alt={attachment.name} />
                                                    <button
                                                        type="button"
                                                        className="remove-btn"
                                                        onClick={() => removeAttachment(attachment.id)}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="file-preview">
                                                    <div className="file-icon">
                                                        {getFileIcon(attachment.type)}
                                                    </div>
                                                    <div className="file-info">
                                                        <span className="file-name">{attachment.name}</span>
                                                        <span className="file-size">{formatFileSize(attachment.size)}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="remove-btn"
                                                        onClick={() => removeAttachment(attachment.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="spinner"></div>
                                        Creating Ticket...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Create Ticket
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};
