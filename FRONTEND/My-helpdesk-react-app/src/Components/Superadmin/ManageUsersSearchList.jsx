import React, { useState, useEffect } from 'react'
import "../Superadmin/Dashboard.css"
import { SearchIcon } from 'lucide-react'
import pencilIcon from "../../assets/pencil.svg"
import trashIcon from "../../assets/trash.svg"
import { getAuthToken, handleAuthError } from '../../utils/auth.js';

export const ManageUsersSearchList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const token = getAuthToken();


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!token) {
                    setError('Authentication required');
                    setLoading(false);
                    return;
                }

                //fetch all users
                const [usersResponse] = await Promise.all([
                    fetch('/api/users', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })

                ]);

                if (handleAuthError(usersResponse)) {
                    return;
                }

                const userData = await usersResponse.json();

                let allUsers = [];

                if (userData.success) {
                    allUsers = [...userData.data];
                }

                setUsers(allUsers);
            } catch (err) {
                console.error("Error fetching Users:", err);
                setError("Failed to load Users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [token]);

    //filter users from search

    const filteredUsers = users.filter(user =>
        user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.status?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    //generate intials for avatar
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
    const renderAvatar = (user) => {
        if (user.profilePic) {
            return (
                <img 
                    src={user.profilePic} 
                    alt={`${user.firstname} ${user.lastname}`}
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
                    backgroundColor: getAvatarColor(user.firstname), 
                    borderRadius: "50%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    color: "white", 
                    fontWeight: "bold",
                    fontSize: "14px"
                }}>
                    {getInitials(user.firstname, user.lastname)}
                </div>
            );
        }
    };


     if (loading) {
        return (
            <div className="search-list-container">
                <div className="top-admin-list">
                    <h2 className='admin-list'>User List</h2>
                    <p>Loading Users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="search-list-container">
                <div className="top-admin-list">
                    <h2 className='admin-list'>User List</h2>
                    <p style={{ color: 'red' }}>Error: {error}</p>
                </div>
            </div>
        );
    }


    return (
        <>
         <div className="search-list-container">
                        <div className="top-admin-list">
                            <h2 className='admin-list'>Users List</h2>
                            <p>Search Users</p>
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
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="empty-state">
                                                    {searchTerm ? 'No admins found matching your search.' : 'No admins found.'}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <tr key={user._id}>
                                                    <td>
                                                        <div className="first-column flex">
                                                            {renderAvatar(user)}
                                                            <p>{user.firstname} {user.lastname}</p>
                                                        </div>
                                                    </td>
                                                    <td className="email-text">{user.email}</td>
                                                    <td className="role-text">{getRoleDisplayName(user.role)}</td>
                                                    <td className="department-text">{user.department || 'N/A'}</td>
                                                    <td>
                                                        <span 
                                                            className="status-badge"
                                                            style={{ 
                                                                backgroundColor: `${getStatusColor(user.status)}20`,
                                                                color: getStatusColor(user.status)
                                                            }}
                                                        >
                                                            {user.status || 'Active'}
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
