import React, { useState } from 'react';
import api from '../api';
import { X, CheckCircle, AlertTriangle, ShieldAlert, UserCheck, Send } from 'lucide-react';

const TriageEvaluationModal = ({ isOpen, onClose, request, onSuccess }) => {
  const [priorityLevel, setPriorityLevel] = useState(request?.urgencyLevel || 'PRIORITY');
  const [remarks, setRemarks] = useState('');
  const [isEscalationMode, setIsEscalationMode] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen || !request) return null;

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      if (isEscalationMode) {
        // Emergency Escalation Path (BR-007 / UC-011)
        await api.post(`/triage/${request.requestId}/escalate`, {
          reason: escalationReason || 'Acute psychological risk requiring physical medical center intake.',
          priority: 'URGENT_EMERGENCY',
        });
      } else {
        // Routine / Priority Clinical Triage Path (UC-010)
        await api.post(`/triage/${request.requestId}/evaluate`, {
          priorityLevel,
          remarks: remarks || 'Clinical intake completed. Approved for consultation.',
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit clinical triage evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderTop: isEscalationMode ? '4px solid #dc2626' : '4px solid var(--primary)' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: isEscalationMode ? '#dc2626' : 'var(--primary)', margin: 0 }}>
              {isEscalationMode ? '🚨 Emergency Clinical Escalation Protocol' : 'Clinical Triage & Case Evaluation'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Request #REQ-{request.requestId} • {request.student?.fullName} ({request.student?.rollNumber})
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <form onSubmit={handleEvaluate}>
          <div className="modal-body">
            {errorMsg && (
              <div
                style={{
                  padding: '0.85rem',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#991b1b',
                  fontSize: '0.84rem',
                  marginBottom: '1rem',
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Case Summary Card */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Service: <strong>{request.service?.title}</strong></span>
                <span className={`badge badge-${request.urgencyLevel?.toLowerCase()}`}>{request.urgencyLevel}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#1e293b', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                "{request.description}"
              </p>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Preferred Mode: {request.preferredMode} • Availability: {request.preferredSchedule}
              </div>
            </div>

            {/* Path Toggle: Routine Evaluation vs Emergency Escalation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${!isEscalationMode ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setIsEscalationMode(false)}
              >
                <UserCheck size={15} />
                <span>Routine / Priority Triage</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${isEscalationMode ? 'btn-danger' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setIsEscalationMode(true)}
              >
                <ShieldAlert size={15} />
                <span>Emergency Medical Escalation</span>
              </button>
            </div>

            {isEscalationMode ? (
              <div>
                <div
                  style={{
                    padding: '0.75rem',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    color: '#991b1b',
                    marginBottom: '1rem',
                  }}
                >
                  ⚠️ <strong>Immediate Medical Referral:</strong> This action dispatches a priority referral directly to the Campus Health Center and logs an institutional audit entry.
                </div>
                <div className="form-group">
                  <label className="form-label">Clinical Risk Justification & Escalation Reason</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Document acute clinical distress, risk assessment observations, and immediate medical coordination needs..."
                    value={escalationReason}
                    onChange={(e) => setEscalationReason(e.target.value)}
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label className="form-label">Assigned Clinical Priority Level</label>
                  <select
                    className="form-select"
                    value={priorityLevel}
                    onChange={(e) => setPriorityLevel(e.target.value)}
                  >
                    <option value="ROUTINE">Routine (Standard Scheduling)</option>
                    <option value="PRIORITY">Priority (Fast-track Consultation)</option>
                    <option value="URGENT">Urgent (Immediate Counselor Attention)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Clinical Triage Notes & Case Recommendations</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Enter counselor triage evaluation notes (e.g. recommended approach, focus areas)..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${isEscalationMode ? 'btn-danger' : 'btn-primary'}`}
              disabled={submitting}
            >
              <Send size={15} />
              <span>
                {submitting
                  ? 'Processing...'
                  : isEscalationMode
                  ? 'Confirm Medical Escalation'
                  : 'Approve & Unlock Slot Booking'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TriageEvaluationModal;
