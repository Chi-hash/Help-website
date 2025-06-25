import React, { useState, useEffect } from 'react'
import "../Superadmin/Dashboard.css"
import { SearchIcon } from 'lucide-react'
import pencilIcon from "../../assets/pencil.svg"
import trashIcon from "../../assets/trash.svg"
import { getAuthToken, handleAuthError } from '../../utils/auth.js';

export const ManageAdminsSearchList = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const token = getAuthToken();

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                if (!token) {
                    setError('Authentication required');
                    setLoading(false);
                    return;
                }

                // Fetch both admins and all users (to filter super admins)
                const [adminsResponse, usersResponse] = await Promise.all([
                    fetch('/api/admins', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }),
                    fetch('/api/users', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })
                ]);

                if (handleAuthError(adminsResponse) || handleAuthError(usersResponse)) {
                    return;
                }

                const adminsData = await adminsResponse.json();
                const usersData = await usersResponse.json();

                let allAdmins = [];

                if (adminsData.success) {
                    allAdmins = [...adminsData.data];
                }

                if (usersData.success) {
                    // Filter super admins from all users
                    const superAdmins = usersData.data.filter(user => 
                        user.role && user.role.toLowerCase() === 'superadmin'
                    );
                    allAdmins = [...allAdmins, ...superAdmins];
                }

                setAdmins(allAdmins);
            } catch (err) {
                console.error('Error fetching admins:', err);
                setError('Failed to load admins');
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, [token]);

    // Filter admins based on search term
    const filteredAdmins = admins.filter(admin => 
        admin.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.department?. toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.status?. toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Generate initials for avatar
    const getInitials = (firstname, lastname) => {
        const first = firstname ? firstname.charAt(0).toUpperCase() : '';
        const last = lastname ? lastname.charAt(0).toUpperCase() : '';
        return first + last;
    };

    // Generate random color for avatar
    const getAvatarColor = (name) => {
        const colors = [
            '#667eea', '#f093fb', '#10b981', '#8b5cf6', '#ef4444', 
            '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'
        ];
        const index = name ? name.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return '#10b981';
            case 'suspended':
                return '#f59e0b';
            case 'inactive':
                return '#6b7280';
            default:
                return '#6b7280';
        }
    };

    // Get role display name
    const getRoleDisplayName = (role) => {
        switch (role?.toLowerCase()) {
            case 'superadmin':
                return 'Super Admin';
            case 'admin':
                return 'Admin';
            case 'it':
                return 'IT Staff';
            case 'staff':
                return 'Staff';
            default:
                return role;
        }
    };

    // Render avatar (profile picture or initials)
    const renderAvatar = (admin) => {
        if (admin.profilePic) {
            return (
                <img 
                    src={admin.profilePic} 
                    alt={`${admin.firstname} ${admin.lastname}`}
                    style={{ 
                        width: "30px", 
                    height: "30px", 
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #e5e7eb"
                    }}
                />
            );
        } else {
            return (
                <div style={{ 
                    width: "30px", 
                    height: "30px", 
                    backgroundColor: getAvatarColor(admin.firstname), 
                    borderRadius: "50%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    color: "white", 
                    fontWeight: "bold",
                    fontSize: "14px"
                }}>
                    {getInitials(admin.firstname, admin.lastname)}
                </div>
            );
        }
    };

    if (loading) {
        return (
            <div className="search-list-container">
                <div className="top-admin-list">
                    <h2 className='admin-list'>Admin List</h2>
                    <p>Loading admins...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="search-list-container">
                <div className="top-admin-list">
                    <h2 className='admin-list'>Admin List</h2>
                    <p style={{ color: 'red' }}>Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="search-list-container">
                <div className="top-admin-list">
                    <h2 className='admin-list'>Admin List</h2>
                    <p>Search Admins and Super Admins</p>
                </div>

                <div className="bottom-admin-list">
                    <div className="input-search">
                        <input 
                            type="text" 
                            name="search-admin" 
                            id="search-admin" 
                            placeholder="Search by name, email, department, status or role..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <SearchIcon style={{ color: "#6c757d" }} />
                    </div>
                    <div className="table-admins">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAdmins.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="empty-state">
                                            {searchTerm ? 'No admins found matching your search.' : 'No admins found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAdmins.map((admin) => (
                                        <tr key={admin._id}>
                                            <td>
                                                <div className="first-column flex">
                                                    {renderAvatar(admin)}
                                                    <p>{admin.firstname} {admin.lastname}</p>
                                                </div>
                                            </td>
                                            <td className="email-text">{admin.email}</td>
                                            <td className="role-text">{getRoleDisplayName(admin.role)}</td>
                                            <td className="department-text">{admin.department || 'N/A'}</td>
                                            <td>
                                                <span 
                                                    className="status-badge"
                                                    style={{ 
                                                        backgroundColor: `${getStatusColor(admin.status)}20`,
                                                        color: getStatusColor(admin.status)
                                                    }}
                                                >
                                                    {admin.status || 'Active'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions flex">
                                                    <img src={pencilIcon} alt="Edit" className='action-icon' />
                                                    <img src={trashIcon} alt="Delete" className='action-icon' />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
