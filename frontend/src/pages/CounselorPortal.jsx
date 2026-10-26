import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import TriageEvaluationModal from '../components/TriageEvaluationModal';
import CompleteSessionModal from '../components/CompleteSessionModal';


const CounselorPortal = () => {
  const { user } = useAuth();
  const [triageQueue, setTriageQueue] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [activeTab, setActiveTab] = useState('triage'); // triage, schedule, slots

  // Slot creation form state
  const [slotDate, setSlotDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:45');
  const [slotSuccessMsg, setSlotSuccessMsg] = useState(null);

  // Modals state
  const [selectedTriageRequest, setSelectedTriageRequest] = useState(null);
  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const loadData = () => {
    // 1. Triage Queue
    api.get('/triage/queue')
      .then((res) => setTriageQueue(res.data || []))
      .catch((err) => console.error(err));

    // 2. All Requests
    api.get('/triage/all')
      .then((res) => setAllRequests(res.data || []))
      .catch((err) => console.error(err));

    // 3. Counselor Appointments
    api.get('/counselor/appointments')
      .then((res) => setAppointments(res.data || []))
      .catch((err) => console.error(err));

    // 4. Counselor Slots
    if (user?.userId) {
      api.get(`/counselors/${user.userId}/slots`)
        .then((res) => setMySlots(res.data || []))
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setSlotSuccessMsg(null);
    try {
      await api.post('/counselor/slots', {
        slotDate,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
      });
      setSlotSuccessMsg('Availability slot successfully published for student booking!');
      setSlotDate('');
      loadData();
      setTimeout(() => setSlotSuccessMsg(null), 3500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create slot');
    }
  };

  return (
    <div className="main-layout">
      {/* Counselor Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '16px',
          padding: '2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#fca5a5' }}>
            <span>Clinical Triage & Consultation Portal</span>
            <span>•</span>
            <span>Staff Privileges</span>
          </div>
          <h2 style={{ fontSize: '1.85rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.35rem' }}>
            {user?.fullName} (Counseling Services)
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '600px', lineHeight: 1.4 }}>
            Prioritize and evaluate incoming student mental health inquiries, publish weekly consultation availability slots, and maintain confidential session notes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f87171' }}>{triageQueue.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pending Triage</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34d399' }}>{appointments.filter(a => a.status === 'CONFIRMED').length}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Confirmed Sessions</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'triage' ? 'active' : ''}`}
          onClick={() => setActiveTab('triage')}
        >
          <span>Prioritized Triage Queue ({triageQueue.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <span>Consultation Agenda ({appointments.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'slots' ? 'active' : ''}`}
          onClick={() => setActiveTab('slots')}
        >
          <span>Publish & Manage Availability Slots ({mySlots.length})</span>
        </button>
      </div>

      {/* Tab 1: Prioritized Triage Queue (UC-010) */}
      {activeTab === 'triage' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Clinical Intake & Triage Queue</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Incoming student inquiries prioritized by clinical urgency level (Urgent ➔ Priority ➔ Routine) and wait time
              </p>
            </div>
          </div>

          {triageQueue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <p style={{ fontWeight: 600 }}>Triage Queue is Clean</p>
              <p style={{ fontSize: '0.8rem' }}>No student support requests currently awaiting review.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {triageQueue.map((req) => (
                <div
                  key={req.requestId}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    background: req.urgencyLevel === 'URGENT' ? '#fff1f2' : '#ffffff',
                    borderLeft: req.urgencyLevel === 'URGENT' ? '5px solid #8c1616' : '5px solid #f59e0b',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                          {req.student?.fullName}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          ({req.student?.rollNumber} • {req.student?.department})
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          #REQ-{req.requestId}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                        Service: {req.service?.title}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className={`badge badge-${req.urgencyLevel?.toLowerCase()}`}>
                        {req.urgencyLevel}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.45, marginBottom: '1rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                    "{req.description}"
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Preferred Mode: <strong>{req.preferredMode}</strong> • Availability: {req.preferredSchedule} • Submitted: {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => { setSelectedTriageRequest(req); setIsTriageModalOpen(true); }}
                    >
                      <span>Evaluate & Triage Case</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Consultation Agenda */}
      {activeTab === 'schedule' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Consultation Schedule & Case Notes</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Manage scheduled consultations and record confidential clinical notes upon session conclusion
              </p>
            </div>
          </div>

          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <p style={{ fontWeight: 600 }}>No consultations scheduled yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {appointments.map((appt) => (
                <div
                  key={appt.appointmentId}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                        Student: {appt.student?.fullName}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        ({appt.student?.rollNumber})
                      </span>
                      <span className={`badge badge-${appt.status?.toLowerCase()}`}>
                        {appt.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.84rem', color: '#475569', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                      <span>Date: {appt.appointmentDate}</span>
                      <span>Time: {appt.startTime} – {appt.endTime}</span>
                      <span>Mode: {appt.mode} ({appt.venue})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    {appt.meetingLink && appt.status === 'CONFIRMED' && (
                      <a
                        href={appt.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-primary"
                        style={{ textDecoration: 'none' }}
                      >
                        <span>Launch Telehealth Call</span>
                      </a>
                    )}

                    {appt.status === 'CONFIRMED' && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => { setSelectedAppointment(appt); setIsCompleteModalOpen(true); }}
                      >
                        <span>Conclude & Log Notes</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Publish Availability Slots */}
      {activeTab === 'slots' && (
        <div className="grid-2">
          {/* Form to Publish New Slot */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>Publish New Availability Slot</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Define 45-minute consultation windows for student booking
            </p>

            {slotSuccessMsg && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '8px',
                  color: '#065f46',
                  fontSize: '0.82rem',
                  marginBottom: '1.25rem',
                }}
              >
                {slotSuccessMsg}
              </div>
            )}

            <form onSubmit={handleCreateSlot}>
              <div className="form-group">
                <label className="form-label">Consultation Date</label>
                <input
                  type="date"
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <span>Publish Slot to Student Calendar</span>
              </button>
            </form>
          </div>

          {/* Current Slots List */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>My Published Consultation Slots</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Real-time slot locking state (Available vs Locked/Booked)
            </p>

            {mySlots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                <p style={{ fontSize: '0.85rem' }}>No availability slots published yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '340px', overflowY: 'auto' }}>
                {mySlots.map((s) => (
                  <div
                    key={s.slotId}
                    style={{
                      padding: '0.85rem 1rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: s.status === 'AVAILABLE' ? '#ffffff' : '#f8fafc',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Date: {s.slotDate}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Time: {s.startTime.substring(0, 5)} – {s.endTime.substring(0, 5)}</div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        background: s.status === 'AVAILABLE' ? '#d1fae5' : '#e2e8f0',
                        color: s.status === 'AVAILABLE' ? '#065f46' : '#475569',
                      }}
                    >
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <TriageEvaluationModal
        isOpen={isTriageModalOpen}
        onClose={() => setIsTriageModalOpen(false)}
        request={selectedTriageRequest}
        onSuccess={loadData}
      />

      <CompleteSessionModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        appointment={selectedAppointment}
        onSuccess={loadData}
      />
    </div>
  );
};

export default CounselorPortal;
