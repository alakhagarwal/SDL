import React from 'react';
import { PhoneCall, ShieldAlert, X, AlertCircle } from 'lucide-react';

const CrisisHotlineModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ borderTop: '4px solid #dc2626', maxWidth: '520px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ background: '#fef2f2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ background: '#fee2e2', padding: '0.45rem', borderRadius: '8px' }}>
              <ShieldAlert size={22} color="#dc2626" />
            </div>
            <div>
              <h3 style={{ color: '#991b1b', fontSize: '1.15rem', margin: 0 }}>
                Immediate Campus Crisis Support
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#b91c1c', margin: 0 }}>
                24/7 LNMIIT Emergency Helplines & Medical Coordination
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#991b1b" />
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              padding: '0.85rem',
              background: '#fff7ed',
              border: '1px solid #ffedd5',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '0.65rem',
              alignItems: 'flex-start',
            }}
          >
            <AlertCircle size={18} color="#c2410c" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.82rem', color: '#9a3412', margin: 0 }}>
              If you or a peer are experiencing acute mental health distress or physical risk,
              please reach out immediately to the contacts below. Confidential on-duty medical staff are available 24/7.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                border: '1px solid #fee2e2',
                borderRadius: '8px',
                background: '#ffffff',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1e293b' }}>
                  LNMIIT Campus Medical Center
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  On-Campus 24/7 Emergency Wing
                </div>
              </div>
              <a
                href="tel:01412688000"
                className="btn btn-sm btn-danger"
                style={{ textDecoration: 'none' }}
              >
                <PhoneCall size={14} />
                <span>+91 141 2688 000</span>
              </a>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: '#ffffff',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1e293b' }}>
                  On-Duty Counseling Cell
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Resident Clinical Officer
                </div>
              </div>
              <a
                href="tel:9414054321"
                className="btn btn-sm btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                <PhoneCall size={14} />
                <span>+91 94140 54321</span>
              </a>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: '#ffffff',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1e293b' }}>
                  Tele-MANAS National Helpline
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Government of India (Toll-Free 24x7)
                </div>
              </div>
              <a
                href="tel:14416"
                className="btn btn-sm btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                <PhoneCall size={14} />
                <span>14416</span>
              </a>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Continue Support Request Submission
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrisisHotlineModal;
