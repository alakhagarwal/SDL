import React from 'react';

const CrisisHotlineModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ borderTop: '4px solid #8c1616', maxWidth: '520px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ background: '#fdf2f2' }}>
          <div>
            <h3 style={{ color: '#8c1616', fontSize: '1.15rem', margin: 0 }}>
              Immediate Campus Crisis Support
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#8c1616', opacity: 0.85, margin: 0 }}>
              24/7 LNMIIT Emergency Helplines &amp; Medical Coordination
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem',
              color: '#8c1616',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
            }}
          >
            ×
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
            }}
          >
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
                border: '1px solid #fecaca',
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
                className="btn btn-sm"
                style={{ textDecoration: 'none', background: '#8c1616', color: '#ffffff', fontWeight: 600 }}
              >
                +91 141 2688 000
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
                +91 94140 54321
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
                14416
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
