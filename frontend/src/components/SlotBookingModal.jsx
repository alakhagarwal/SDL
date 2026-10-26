import React, { useState, useEffect } from 'react';
import api from '../api';

const SlotBookingModal = ({ isOpen, onClose, request, onSuccess }) => {
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [mode, setMode] = useState(request?.preferredMode || 'Telehealth');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [confirmedAppt, setConfirmedAppt] = useState(null);

  useEffect(() => {
    if (!isOpen || !request) return;
    setLoading(true);
    setErrorMsg(null);
    setConfirmedAppt(null);

    const counselorId = request.assignedCounselor?.userId;
    const url = counselorId ? `/counselors/${counselorId}/slots` : `/counselors/slots/all`;

    api.get(url)
      .then((res) => {
        setSlots(res.data || []);
        if (res.data?.length > 0) {
          setSelectedSlotId(res.data[0].slotId);
        }
      })
      .catch((err) => {
        console.error('Failed to load availability slots', err);
        setErrorMsg('Failed to fetch available counselor slots. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [isOpen, request]);

  if (!isOpen || !request) return null;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedSlotId) {
      setErrorMsg('Please select an available consultation slot.');
      return;
    }

    setBooking(true);
    setErrorMsg(null);

    try {
      const res = await api.post('/appointments/book', {
        requestId: request.requestId,
        slotId: selectedSlotId,
        mode,
      });
      setConfirmedAppt(res.data);
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book consultation slot. Please try another slot.';
      setErrorMsg(msg);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>
              Schedule Counseling Consultation Slot
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Request #REQ-{request.requestId} • {request.service?.title}
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

        {confirmedAppt ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div
              style={{
                display: 'inline-block',
                background: '#d1fae5',
                color: '#065f46',
                fontWeight: 700,
                fontSize: '0.82rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Confirmed
            </div>
            <h3 style={{ color: '#065f46', fontSize: '1.25rem', marginBottom: '0.35rem' }}>
              Consultation Successfully Confirmed!
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '1.5rem' }}>
              Your consultation has been confirmed with {confirmedAppt.counselor?.fullName}.
            </p>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                textAlign: 'left',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ marginBottom: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
                Date: {confirmedAppt.appointmentDate}
              </div>
              <div style={{ marginBottom: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
                Time: {confirmedAppt.startTime} – {confirmedAppt.endTime}
              </div>
              <div style={{ marginBottom: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
                Mode: {confirmedAppt.mode} ({confirmedAppt.venue})
              </div>

              {confirmedAppt.meetingLink && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.85rem',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', textTransform: 'uppercase' }}>
                    Encrypted Telehealth Consultation Link
                  </div>
                  <a
                    href={confirmedAppt.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-block',
                      color: '#2563eb',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      marginTop: '0.35rem',
                      wordBreak: 'break-all',
                    }}
                  >
                    {confirmedAppt.meetingLink}
                  </a>
                </div>
              )}
            </div>

            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleBook}>
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

              {/* Advance notice rule notice */}
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  color: '#475569',
                  marginBottom: '1.25rem',
                }}
              >
                <strong>Advance Booking Notice:</strong> Routine counseling sessions must be scheduled with a minimum of 24 hours notice.
              </div>

              {/* Consultation Mode */}
              <div className="form-group">
                <label className="form-label">Consultation Delivery Mode</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <input
                      type="radio"
                      name="bookMode"
                      value="Telehealth"
                      checked={mode === 'Telehealth'}
                      onChange={(e) => setMode(e.target.value)}
                    />
                    Online Telehealth (Unique Video Link)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <input
                      type="radio"
                      name="bookMode"
                      value="In-person"
                      checked={mode === 'In-person'}
                      onChange={(e) => setMode(e.target.value)}
                    />
                    In-Person (SAC Room 204)
                  </label>
                </div>
              </div>

              {/* Available Slots Grid */}
              <div className="form-group">
                <label className="form-label">
                  Select 45-Minute Consultation Time Slot
                </label>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                    Loading real-time counselor calendar...
                  </div>
                ) : slots.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '1.5rem',
                      background: '#fffbeb',
                      borderRadius: '8px',
                      color: '#b45309',
                      fontSize: '0.85rem',
                    }}
                  >
                    No open availability slots found for this counselor at this moment. Please check back shortly or consult on-duty staff.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', maxHeight: '240px', overflowY: 'auto' }}>
                    {slots.map((s) => (
                      <label
                        key={s.slotId}
                        style={{
                          border: selectedSlotId === s.slotId ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: selectedSlotId === s.slotId ? 'var(--primary-light)' : '#ffffff',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                        }}
                      >
                        <input
                          type="radio"
                          name="slotSelection"
                          value={s.slotId}
                          checked={selectedSlotId === s.slotId}
                          onChange={() => setSelectedSlotId(s.slotId)}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                            {s.slotDate}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                            {s.startTime.substring(0, 5)} – {s.endTime.substring(0, 5)}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {s.counselor?.fullName}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={booking || slots.length === 0 || !selectedSlotId}
              >
                <span>{booking ? 'Locking Slot...' : 'Confirm Appointment'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SlotBookingModal;
