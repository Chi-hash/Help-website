import React, { useEffect, useState, useRef } from 'react';
import shieldicon from "../../assets/shield-check.svg";
import { getUserData } from '../../utils/auth';
import "../Superadmin/Dashboard.css";
import "./NotificationBottom.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

const getAvatar = (user) =>
  user.profilePic ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    (user.firstname || "") + " " + (user.lastname || "")
  )}`;

const getActionInfo = (notif) => {
  // You can customize this logic based on notification type
  if (notif.type === 'login') {
    return notif.success ? 'Login Success' : 'Failed Login';
  }
  if (notif.type === 'role-change') {
    return 'Role changed';
  }
  if (notif.type === 'ticket') {
    return 'Created new ticket';
  }
  return notif.message;
};


export const NotificationBottom = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpenIdx, setMenuOpenIdx] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({});
  const currentUser = getUserData();
  const menuRefs = useRef([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${BACKEND_URL}/api/notifications/latest?limit=6`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    })
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuOpenIdx !== null && menuRefs.current[menuOpenIdx] && !menuRefs.current[menuOpenIdx].contains(event.target)) {
        setMenuOpenIdx(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpenIdx]);

  // Adjust dropdown position to stay in viewport
  useEffect(() => {
    if (menuOpenIdx !== null && menuRefs.current[menuOpenIdx]) {
      const rect = menuRefs.current[menuOpenIdx].getBoundingClientRect();
      const rightOverflow = rect.right - window.innerWidth;
      if (rightOverflow > 0) {
        setDropdownPos((prev) => ({ ...prev, [menuOpenIdx]: { right: rightOverflow + 8 } }));
      } else {
        setDropdownPos((prev) => ({ ...prev, [menuOpenIdx]: { right: 0 } }));
      }
    }
  }, [menuOpenIdx]);

  // Dropdown menu actions
  const handleViewDetails = (notif) => {
    alert(`Details:\n${JSON.stringify(notif, null, 2)}`);
  };
  const handleMarkReadUnread = (notif) => {
    alert(`Mark as ${notif.read ? 'Unread' : 'Read'}: ${notif.message}`);
  };
  const handleCopyMessage = (notif) => {
    navigator.clipboard.writeText(notif.message);
    alert('Message copied to clipboard!');
  };
  const handleGoToRelated = (notif) => {
    if (notif.ticketId) {
      window.open(`/manage-tickets/ticket-notes?id=${notif.ticketId._id || notif.ticketId}`, '_blank');
    } else if (notif.createdBy && notif.createdBy.email) {
      window.open(`/manage-users?email=${notif.createdBy.email}`, '_blank');
    } else {
      alert('No related item to go to.');
    }
  };
  const handleDelete = (notif) => {
    alert('Delete action (admin only) - implement API call here.');
  };

  return (
    <div style={{ marginTop: '2rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 24 }}>
      <h3 style={{ marginBottom: 18, fontWeight: 600, fontSize: 20 }}>Audit Logs</h3>
      {loading ? (
        <div>Loading...</div>
      ) : notifications.length === 0 ? (
        <div>No notifications found.</div>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr className='headers' style={{ textAlign: 'left', borderBottom: '2px solid #f3f3f3', fontWeight: 500 }}>
                <th style={{ padding: '10px 0', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '10px 0', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '10px 0', fontWeight: 600 }}>Message</th>
                <th style={{ padding: '10px 0', fontWeight: 600 }}>Time</th>
                <th style={{ padding: '10px 0', fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n, idx) => {
                const user = n.createdBy || {};
                const isYou = currentUser && user.email && user.email === currentUser.email;
                const displayName = isYou ? `${user.firstname} (you)` : user.firstname;
                const displayRole = (user.role || '').toLowerCase() === 'superadmin' ? 'SuperAdmin' :
                  (user.role || '').toLowerCase() === 'admin' ? 'Admin' :
                  (user.role || '').toLowerCase() === 'it' ? 'IT Staff' :
                  (user.role || '').toLowerCase() === 'staff' ? 'Staff' : (user.role || '');
                const isAdmin = ["admin", "superadmin"].includes((currentUser?.role || '').toLowerCase());
                return (
                  <tr className='notification-tr' key={n._id || idx} style={{ borderBottom: '1px solid #f3f3f3', height: 60 }}>
                    {/* Avatar, Name, Shield */}
                    <td className='rounded-row1' style={{ minWidth: 180, padding: '8px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                         {["admin", "superadmin"].includes((user.role || '').toLowerCase()) && (
                          <img src={shieldicon} alt="admin" title="Admin" style={{ width: 18, height: 18, marginLeft: 4 }} />
                        )}
                        <img src={getAvatar(user)} alt="profile" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }} />
                        <span style={{ fontWeight: 500, fontSize: 15 }}>
                          {displayName} {user.lastname}
                        </span>
                       
                      </div>
                    </td>
                    {/* Role */}
                    <td  style={{ minWidth: 100, color: '#555', fontWeight: 500 }}>{displayRole}</td>
                    {/* Action/Info */}
                    <td  style={{ minWidth: 160, color: '#222', fontWeight: 400 }}>{getActionInfo(n)}</td>
                    {/* Time */}
                    <td  style={{ minWidth: 110, color: '#888', fontWeight: 400 }}>{timeAgo(n.createdAt)}</td>
                    {/* menu */}
                    <td className='rounded-row2' style={{ minWidth: 30, textAlign: 'right', position: 'relative' }}>
                      <span
                        className='menuicon notif-menuicon'
                        style={{ fontSize: 22, color: '#444', cursor: 'pointer', transition: 'color 0.2s' }}
                        onClick={() => setMenuOpenIdx(menuOpenIdx === idx ? null : idx)}
                        ref={el => menuRefs.current[idx] = el}
                      >
                        ⋮
                      </span>
                      {menuOpenIdx === idx && (
                        <div
                          className='notif-dropdown'
                          style={{
                            position: 'absolute',
                            right: dropdownPos[idx]?.right || 0,
                            top: 28,
                            minWidth: 200,
                            background: '#fff',
                            border: '1px solid #eee',
                            borderRadius: 6,
                            boxShadow: '0 2px 8px #eee',
                            zIndex: 10,
                            opacity: menuOpenIdx === idx ? 1 : 0,
                            transform: menuOpenIdx === idx ? 'translateY(0)' : 'translateY(10px)',
                            pointerEvents: menuOpenIdx === idx ? 'auto' : 'none',
                            transition: 'opacity 0.25s cubic-bezier(.4,0,.2,1), transform 0.25s cubic-bezier(.4,0,.2,1)',
                          }}
                        >
                          <div className='notif-dropdown-item' onClick={() => { handleViewDetails(n); setMenuOpenIdx(null); }}>View Details</div>
                          <div className='notif-dropdown-item' onClick={() => { handleMarkReadUnread(n); setMenuOpenIdx(null); }}>Mark as Read/Unread</div>
                          <div className='notif-dropdown-item' onClick={() => { handleCopyMessage(n); setMenuOpenIdx(null); }}>Copy Message</div>
                          <div className='notif-dropdown-item' style={{ color: n.ticketId || (n.createdBy && n.createdBy.email) ? '#222' : '#bbb', cursor: n.ticketId || (n.createdBy && n.createdBy.email) ? 'pointer' : 'not-allowed' }} onClick={() => { handleGoToRelated(n); setMenuOpenIdx(null); }}>Go to Related Item</div>
                          {isAdmin && (
                            <div className='notif-dropdown-item' style={{ color: 'red' }} onClick={() => { handleDelete(n); setMenuOpenIdx(null); }}>Delete</div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NotificationBottom;
