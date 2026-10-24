import React, { useState, useEffect } from 'react';
import api from '../api';
import { Stethoscope, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

const HealthCenterPortal = () => {
  const [referrals, setReferrals] = useState([]);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [intakeNotes, setIntakeNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReferrals = () => {
    api.get('/health-center/referrals')
      .then((res) => setReferrals(res.data || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadReferrals();
  }, []);

  const handleAcknowledge = async (e) => {
    e.preventDefault();
    if (!selectedReferral) return;
    setSubmitting(true);
    try {
      await api.post(`/health-center/referrals/${selectedReferral.referralId}/acknowledge`, {
        notes: intakeNotes || 'Student intake coordinated at campus medical center.',
      });
      setSelectedReferral(null);
      setIntakeNotes('');
      loadReferrals();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to acknowledge referral');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-layout">
      {/* Health Center Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
          borderRadius: '16px',
          padding: '2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px -5px rgba(153, 27, 27, 0.3)',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          <Stethoscope size={14} />
          <span>Campus Health Center • Medical Referral & Emergency Desk</span>
        </div>
        <h2 style={{ fontSize: '1.85rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.35rem' }}>
          Emergency Clinical Intake Desk
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#fecaca', maxWidth: '600px', lineHeight: 1.4 }}>
          Immediate triage escalations initiated by campus counselors for acute student psychological support, medical observation, or crisis intervention.
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Escalated Emergency Support Cases</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Prioritized direct medical referrals requiring clinical intake acknowledgement
            </p>
          </div>
        </div>

        {referrals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <CheckCircle size={40} color="#10b981" style={{ marginBottom: '0.75rem' }} />
            <p style={{ fontWeight: 600 }}>No Active Emergency Referrals</p>
            <p style={{ fontSize: '0.8rem' }}>Campus medical unit is currently all clear.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {referrals.map((ref) => (
              <div
                key={ref.referralId}
                style={{
                  padding: '1.25rem',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  background: ref.referralStatus === 'PENDING_INTAKE' ? '#fff1f2' : '#ffffff',
                  borderLeft: '5px solid #dc2626',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>
                      🚨 {ref.priority} • #REF-{ref.referralId}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', margin: '0.2rem 0' }}>
                      Student: {ref.request?.student?.fullName} ({ref.request?.student?.rollNumber} • {ref.request?.student?.department})
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Referred By: <strong>{ref.counselor?.fullName}</strong> • Timestamp: {new Date(ref.referredAt).toLocaleString()}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      background: ref.referralStatus === 'PENDING_INTAKE' ? '#fee2e2' : '#d1fae5',
                      color: ref.referralStatus === 'PENDING_INTAKE' ? '#991b1b' : '#065f46',
                    }}
                  >
                    {ref.referralStatus}
                  </span>
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #fee2e2',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    marginBottom: '0.85rem',
                    fontSize: '0.85rem',
                    color: '#1e293b',
                  }}
                >
                  <strong>Clinical Justification:</strong> "{ref.reason}"
                </div>

                {ref.referralStatus === 'PENDING_INTAKE' ? (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setSelectedReferral(ref)}
                    >
                      <span>Acknowledge Intake & Record Medical Action</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: '#059669', fontStyle: 'italic' }}>
                    ✓ Intake acknowledged. Notes: "{ref.intakeNotes || 'Intake completed.'}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Intake Modal */}
      {selectedReferral && (
        <div className="modal-overlay" onClick={() => setSelectedReferral(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderTop: '4px solid #dc2626' }}>
              <h3 style={{ margin: 0, color: '#dc2626' }}>
                Acknowledge Emergency Intake (#REF-{selectedReferral.referralId})
              </h3>
            </div>
            <form onSubmit={handleAcknowledge}>
              <div className="modal-body">
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
                  Confirm physical arrival or telehealth triage coordination for <strong>{selectedReferral.request?.student?.fullName}</strong>.
                </p>
                <div className="form-group">
                  <label className="form-label">Health Center Action & Intake Notes</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Document vitals, duty doctor intervention, hostel warden notification, or follow-up clinical protocol..."
                    value={intakeNotes}
                    onChange={(e) => setIntakeNotes(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedReferral(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" disabled={submitting}>
                  {submitting ? 'Recording...' : 'Confirm Intake Acknowledgement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCenterPortal;
