import React from 'react';

export const SettingsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.45)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        padding: '2.5rem 2rem',
        minWidth: 340,
        maxWidth: 420,
        width: '95vw',
        boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
        position: 'relative',
        border: '1.5px solid #e0e0e0',
        color: '#232336',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: 16, right: 16,
          background: 'none',
          border: 'none',
          fontSize: 26,
          color: '#232336',
          cursor: 'pointer',
        }}>&times;</button>
        <h2 style={{ marginBottom: 24, textAlign: 'center', fontWeight: 700, letterSpacing: 0.5 }}>Settings</h2>
        <div style={{ textAlign: 'center', color: '#888', fontSize: 16 }}>
          Settings modal placeholder.
        </div>
      </div>
    </div>
  );
}; 