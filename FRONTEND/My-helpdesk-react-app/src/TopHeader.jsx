import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit, LogOut, User, Settings } from 'lucide-react';
import { getAuthToken, getUserData, handleAuthError } from './utils/auth.js';
import { SettingsModal } from './Components/Superadmin/SettingsModal';

export const TopHeader = () => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const fileInputRef = useRef(null);
  const popupRef = useRef(null);

  const user = getUserData() || {};

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    setTimeout(() => {
      window.location.href = '/';
      setShowLogoutModal(false);
    }, 1000);
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if user is authenticated
    const token = getAuthToken();
    const userData = getUserData();
    
    if (!token || !userData) {
      alert('Please log in to upload a profile picture');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('profilePic', file);

      const response = await fetch('/api/users/upload-profile-pic', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update user data in localStorage
        const updatedUser = { ...userData, profilePic: data.profilePic };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Force re-render
        window.location.reload();
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: 'Unknown error occurred' };
        }
        
        if (handleAuthError(response)) {
          return; // Auth error was handled
        } else {
          throw new Error(errorData.message || 'Failed to upload profile picture');
        }
      }
    } catch (error) {
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'superAdmin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'staff': return 'Staff';
      case 'it': return 'IT Staff';
      default: return role;
    }
  };

  const getInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <>
      <div className="topheader-div">
        <div className="left">
          <h2 className='welcome-message'>Welcome {user.firstname},</h2>
        </div>
        <div className="right">
          <p className="role-badge">{getRoleDisplayName(user.role)}</p>
          <div 
            className='profile-container'
            onClick={() => setShowProfilePopup(!showProfilePopup)}
          >
            {user.profilePic ? (
              <img 
                src={user.profilePic} 
                alt="Profile" 
                className="profile-picture"
              />
            ) : (
              <div className="profile-initials">
                {getInitials(user.firstname, user.lastname)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Popup */}
      <AnimatePresence>
        {showProfilePopup && (
          <motion.div
            className="profile-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={popupRef}
              className="profile-popup"
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="profile-header">
                <div className="profile-picture-section">
                  {user.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt="Profile" 
                      className="profile-picture-large"
                    />
                  ) : (
                    <div className="profile-initials-large">
                      {getInitials(user.firstname, user.lastname)}
                    </div>
                  )}
                  <button 
                    className="change-photo-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Camera size={16} />
                    {isUploading ? 'Uploading...' : 'Change Photo'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="profile-info">
                <div className="info-item">
                  <label>Name</label>
                  <p>{user.firstname} {user.lastname}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-item">
                  <label>Role</label>
                  <p>{getRoleDisplayName(user.role)}</p>
                </div>
                {user.department && (
                  <div className="info-item">
                    <label>Department</label>
                    <p>{user.department}</p>
                  </div>
                )}
              </div>

              <div className="profile-actions">
                <button className="action-btn settings-btn" onClick={() => setShowSettingsModal(true)}>
                  <Settings size={16} />
                  Settings
                </button>
                <button 
                  className="action-btn logout-btn"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} user={user} />

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="logout-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-content">
              <p>Are you sure you want to logout?</p>
              <div className="modal-buttons">
                <button onClick={handleLogout} disabled={isLoggingOut}>
                  {isLoggingOut ? "Logging out..." : "Yes, Logout"}
                </button>
                <button onClick={() => setShowLogoutModal(false)}>Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
