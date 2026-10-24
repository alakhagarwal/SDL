import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { X, CheckCheck, Bell, Calendar, AlertTriangle, MessageSquare } from 'lucide-react';

const NotificationDrawer = () => {
  const { notifications, unreadCount, isDrawerOpen, setIsDrawerOpen, markAsRead, markAllAsRead } = useNotifications();

  if (!isDrawerOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'BOOKING_CONFIRMATION':
        return <Calendar size={18} color="#059669" />;
      case 'ESCALATION_ALERT':
        return <AlertTriangle size={18} color="#dc2626" />;
      case 'REQUEST_UPDATE':
        return <MessageSquare size={18} color="#2563eb" />;
      default:
        return <Bell size={18} color="#8b1523" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(3px)',
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={() => setIsDrawerOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.22s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Bell size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Notification Center</h3>
            {unreadCount > 0 && (
              <span
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                }}
              >
                {unreadCount} new
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
                }}
                title="Mark all as read"
              >
                <CheckCheck size={16} />
                <span>Read all</span>
              </button>
            )}
            <button
              onClick={() => setIsDrawerOpen(false)}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <Bell size={36} color="#cbd5e1" style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontWeight: 500 }}>No notifications yet</p>
              <p style={{ fontSize: '0.8rem' }}>Status updates and alerts will appear here in real-time.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.notificationId}
                onClick={() => !n.isRead && markAsRead(n.notificationId)}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: n.isRead ? '#ffffff' : '#fef2f2',
                  border: n.isRead ? '1px solid #f1f5f9' : '1px solid #fecdd3',
                  marginBottom: '0.75rem',
                  cursor: n.isRead ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                {!n.isRead && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '50%',
                    }}
                  />
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    style={{
                      padding: '0.45rem',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }}
                  >
                    {getIcon(n.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                      {n.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.4 }}>
                      {n.message}
                    </p>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.4rem', display: 'block' }}>
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
