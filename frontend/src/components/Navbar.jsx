import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import CrisisHotlineModal from './CrisisHotlineModal';
import {
  Bell,
  LogOut,
  Shield,
  User,
  HeartPulse,
  Stethoscope,
  PhoneCall,
  AlertCircle,
  Building2,
  Lock
} from 'lucide-react';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const { unreadCount, setIsDrawerOpen } = useNotifications();
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  return (
    <>
      {/* Institutional Top Utility Header */}
      <div className="inst-utility-bar">
        <div className="inst-utility-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Building2 size={13} color="#fecdd3" />
            <span style={{ fontWeight: 600 }}>The LNM Institute of Information Technology, Jaipur</span>
            <span style={{ opacity: 0.6 }}>•</span>
            <span style={{ opacity: 0.85 }}>Deemed-to-be-University (NAAC 'A' Grade)</span>
          </div>

          <div className="inst-utility-links">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fecdd3' }}>
              <PhoneCall size={12} />
              <span>Campus Medical Center: <strong>+91 141 2688000</strong></span>
            </div>
            <span style={{ opacity: 0.5 }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fecdd3' }}>
              <span>Tele-MANAS Toll-Free: <strong>14416</strong></span>
            </div>
            <span style={{ opacity: 0.5 }}>|</span>
            <button
              onClick={() => setIsCrisisModalOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#ffffff',
                padding: '0.15rem 0.55rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
              title="24/7 Campus Crisis Helpline Protocol"
            >
              <AlertCircle size={12} color="#fca5a5" />
              <span>Emergency 24x7</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Institutional Navigation Header */}
      <header className="navbar">
        <div className="nav-container">
          <div className="brand-wrapper">
            <div className="brand-logo-badge">
              <HeartPulse size={24} />
            </div>
            <div className="brand-titles">
              <h1>Student Wellness Portal</h1>
              <p>Center for Counseling & Psychological Health Services</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user && (
              <>
                {/* In-App Notification Bell */}
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  style={{
                    position: 'relative',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="In-App Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        background: '#dc2626',
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        borderRadius: '9999px',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(220,38,38,0.4)',
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* User Profile Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.35rem 0.85rem',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '9999px',
                  }}
                >
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {role === 'STUDENT' ? <User size={16} /> : role === 'COUNSELOR' ? <HeartPulse size={16} /> : role === 'HEALTH_CENTER' ? <Stethoscope size={16} /> : <Shield size={16} />}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {user.fullName}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {role === 'STUDENT'
                        ? `Student ${user.rollNumber ? `• ${user.rollNumber}` : ''}`
                        : role === 'COUNSELOR'
                        ? 'Counseling Staff'
                        : role === 'HEALTH_CENTER'
                        ? 'Campus Medical Desk'
                        : 'Administrator'}
                    </div>
                  </div>
                </div>

                {/* Institutional Sign Out Button */}
                <button
                  onClick={logout}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.45rem 0.85rem' }}
                  title="Sign Out of Portal"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Crisis Hotline Modal Accessible Universally */}
      <CrisisHotlineModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
