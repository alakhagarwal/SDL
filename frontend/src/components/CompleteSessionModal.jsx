import React, { useState } from 'react';
import api from '../api';

const CompleteSessionModal = ({ isOpen, onClose, appointment, onSuccess }) => {
  const [sessionSummary, setSessionSummary] = useState('');
  const [clinicalObservations, setClinicalObservations] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [outcomeCategory, setOutcomeCategory] = useState('Follow-up Required');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      await api.post(`/appointments/${appointment.appointmentId}/complete`, {
        sessionSummary,
        clinicalObservations,
        actionPlan,
        outcomeCategory,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to complete session.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>
              Record Confidential Clinical Consultation Notes
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Session Concluded • Student: {appointment.student?.fullName} ({appointment.appointmentDate})
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem',
              color: '#64748b',
              fontWeight: 700,
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div
                style={{
                  padding: '0.85rem',
                  background: '#fdf2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#8c1616',
                  fontSize: '0.84rem',
                  marginBottom: '1rem',
                }}
              >
                {errorMsg}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Clinical Outcome Categorization</label>
              <select
                className="form-select"
                value={outcomeCategory}
                onChange={(e) => setOutcomeCategory(e.target.value)}
                required
              >
                <option value="Follow-up Required">Follow-up Session Required</option>
                <option value="Issue Resolved">Issue Resolved / Goal Achieved</option>
                <option value="Referred to Specialized Therapy">Referred to Specialized Therapy</option>
                <option value="Self-Guided Resources Recommended">Self-Guided Resources Recommended</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Session Summary &amp; Therapeutic Discussion</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Document core topics explored, cognitive reflections, and client presentation..."
                value={sessionSummary}
                onChange={(e) => setSessionSummary(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Observations &amp; Mental State Exam (Confidential)</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Affect, coping mechanisms, symptom intensity..."
                value={clinicalObservations}
                onChange={(e) => setClinicalObservations(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Action Plan &amp; Student Homework</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Actionable coping exercises, sleep hygiene goals, mindfulness practices..."
                value={actionPlan}
                onChange={(e) => setActionPlan(e.target.value)}
              />
            </div>

            <div
              style={{
                padding: '0.75rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: '#475569',
              }}
            >
              <span>
                <strong>Confidential Clinical Record:</strong> Accessible solely to the authoring counselor and campus clinical health leads.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <span>{submitting ? 'Archiving Case...' : 'Finalize & Archive Consultation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteSessionModal;
