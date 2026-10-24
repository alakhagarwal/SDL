import React, { useState } from 'react';
import api from '../api';
import CrisisHotlineModal from './CrisisHotlineModal';
import { X, AlertCircle, ShieldCheck, CheckCircle2, Send, Info } from 'lucide-react';

const RequestSupportModal = ({ isOpen, onClose, services, selectedService, onSuccess }) => {
  const [serviceId, setServiceId] = useState(selectedService?.serviceId || (services[0]?.serviceId || ''));
  const [urgencyLevel, setUrgencyLevel] = useState('ROUTINE');
  const [preferredMode, setPreferredMode] = useState('In-person');
  const [description, setDescription] = useState('');
  const [preferredSchedule, setPreferredSchedule] = useState('Weekday afternoons');
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleUrgencyChange = (e) => {
    const val = e.target.value;
    setUrgencyLevel(val);
    if (val === 'URGENT') {
      setIsCrisisModalOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await api.post('/requests', {
        serviceId: Number(serviceId),
        urgencyLevel,
        preferredMode,
        description,
        preferredSchedule,
      });
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit support request. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>
                Submit Confidential Wellness Support Request
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Formal Institutional Intake & Clinical Routing
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="#64748b" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errorMsg && (
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    color: '#991b1b',
                    fontSize: '0.84rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>{errorMsg}</div>
                </div>
              )}

              {/* Service Selection */}
              <div className="form-group">
                <label className="form-label">Select Wellness Service Domain</label>
                <select
                  className="form-select"
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  required
                >
                  {services.map((s) => (
                    <option key={s.serviceId} value={s.serviceId}>
                      {s.title} ({s.category} • {s.mode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency Classification with guided indicators */}
              <div className="form-group">
                <label className="form-label">
                  Clinical Urgency Classification
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                  <label
                    style={{
                      border: urgencyLevel === 'ROUTINE' ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
                      background: urgencyLevel === 'ROUTINE' ? '#eff6ff' : '#ffffff',
                      borderRadius: '8px',
                      padding: '0.65rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value="ROUTINE"
                      checked={urgencyLevel === 'ROUTINE'}
                      onChange={handleUrgencyChange}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e40af' }}>Routine</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Standard care / Ongoing habit</div>
                  </label>

                  <label
                    style={{
                      border: urgencyLevel === 'PRIORITY' ? '2px solid var(--accent-amber)' : '1px solid var(--border)',
                      background: urgencyLevel === 'PRIORITY' ? '#fffbeb' : '#ffffff',
                      borderRadius: '8px',
                      padding: '0.65rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value="PRIORITY"
                      checked={urgencyLevel === 'PRIORITY'}
                      onChange={handleUrgencyChange}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#b45309' }}>Priority</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Elevated distress / Exam anxiety</div>
                  </label>

                  <label
                    style={{
                      border: urgencyLevel === 'URGENT' ? '2px solid var(--accent-red)' : '1px solid var(--border)',
                      background: urgencyLevel === 'URGENT' ? '#fef2f2' : '#ffffff',
                      borderRadius: '8px',
                      padding: '0.65rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value="URGENT"
                      checked={urgencyLevel === 'URGENT'}
                      onChange={handleUrgencyChange}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#b91c1c' }}>🚨 Urgent</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Immediate triage alert (24/7)</div>
                  </label>
                </div>
              </div>

              {/* Consultation Mode */}
              <div className="form-group">
                <label className="form-label">Preferred Consultation Mode</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <input
                      type="radio"
                      name="mode"
                      value="In-person"
                      checked={preferredMode === 'In-person'}
                      onChange={(e) => setPreferredMode(e.target.value)}
                    />
                    In-Person Consultation (SAC Wing)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <input
                      type="radio"
                      name="mode"
                      value="Telehealth"
                      checked={preferredMode === 'Telehealth'}
                      onChange={(e) => setPreferredMode(e.target.value)}
                    />
                    Virtual Telehealth (Encrypted Link)
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Background & Specific Concern Details</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe your current concern or challenges in confidence..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Preferred Time */}
              <div className="form-group">
                <label className="form-label">Preferred Scheduling Availability</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Weekday afternoons after 4 PM, Saturdays"
                  value={preferredSchedule}
                  onChange={(e) => setPreferredSchedule(e.target.value)}
                />
              </div>

              {/* Confidentiality Notice */}
              <div
                style={{
                  padding: '0.75rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.78rem',
                  color: '#475569',
                }}
              >
                <ShieldCheck size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Strict Confidentiality Guarantee:</strong> Clinical notes are encrypted and restricted solely to assigned institutional psychological staff.
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                <Send size={15} />
                <span>{isSubmitting ? 'Submitting Request...' : 'Submit Support Request'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <CrisisHotlineModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />
    </>
  );
};

export default RequestSupportModal;
