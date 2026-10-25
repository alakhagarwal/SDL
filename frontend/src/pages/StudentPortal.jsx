import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import HabitWidget from '../components/HabitWidget';
import RequestSupportModal from '../components/RequestSupportModal';
import SlotBookingModal from '../components/SlotBookingModal';
import CrisisHotlineModal from '../components/CrisisHotlineModal';
import {
  HeartHandshake,
  Calendar,
  Clock,
  Video,
  MapPin,
  PlusCircle,
  AlertTriangle,
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Shield,
  LifeBuoy
} from 'lucide-react';

const StudentPortal = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [modalSelectedService, setModalSelectedService] = useState(null);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [selectedTriagedRequest, setSelectedTriagedRequest] = useState(null);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, services, appointments, resources

  const loadData = () => {
    // 1. Services
    api.get('/services')
      .then((res) => setServices(res.data || []))
      .catch((err) => console.error(err));

    // 2. Student Requests
    api.get('/requests/my')
      .then((res) => setMyRequests(res.data || []))
      .catch((err) => console.error(err));

    // 3. Student Appointments
    api.get('/appointments/my')
      .then((res) => setMyAppointments(res.data || []))
      .catch((err) => console.error(err));

    // 4. Psychoeducational resources
    api.get('/resources')
      .then((res) => setArticles(res.data || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelRequest = async (requestId) => {
    const reason = window.prompt('Please provide a mandatory reason for cancellation (FR-030):');
    if (!reason) return;

    try {
      await api.post(`/requests/${requestId}/cancel`, { reason });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel request');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const confirm = window.confirm('Are you sure you want to cancel this appointment? Cancellations require at least 4 hours notice (BR-009).');
    if (!confirm) return;

    try {
      await api.post(`/appointments/${appointmentId}/cancel`, { reason: 'Student cancelled via dashboard' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="main-layout">
      {/* Student Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #8b1523 0%, #6b0f1a 60%, #4d0910 100%)',
          borderRadius: '14px',
          padding: '1.75rem 2rem',
          color: '#ffffff',
          marginBottom: '1.75rem',
          boxShadow: '0 8px 20px rgba(139, 21, 35, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.12)', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.65rem', letterSpacing: '0.02em' }}>
            <span>LNMIIT Student Wellness Portal</span>
            <span style={{ opacity: 0.6 }}>·</span>
            <span>Strictly Confidential</span>
          </div>
          <h2 style={{ fontSize: '1.65rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.3rem', letterSpacing: '-0.03em' }}>
            Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', maxWidth: '520px', lineHeight: 1.5 }}>
            Access mental health services, schedule consultations, and track your daily wellness — all in one place.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            className="btn"
            style={{ background: '#ffffff', color: '#8b1523', fontWeight: 700, fontSize: '0.85rem' }}
            onClick={() => { setModalSelectedService(services[0]); setIsRequestModalOpen(true); }}
          >
            <PlusCircle size={15} />
            <span>Request Support</span>
          </button>
          <button
            className="btn"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)', fontSize: '0.85rem' }}
            onClick={() => setIsCrisisModalOpen(true)}
          >
            <LifeBuoy size={15} />
            <span>Crisis Helplines</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span>Dashboard Overview</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          <span>Wellness Services ({services.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <span>My Scheduled Consultations ({myAppointments.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          <span>Self-Help Guides ({articles.length})</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid-3">
          {/* Column 1 & 2: Active Requests & Appointments */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Real-Time Request Status Tracker (UC-005 & UC-007) */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Active Support Inquiries & Consultation Status</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    Track real-time progress of your inquiries from intake review to scheduled consultation
                  </p>
                </div>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => { setModalSelectedService(services[0]); setIsRequestModalOpen(true); }}
                >
                  <PlusCircle size={14} />
                  <span>New Request</span>
                </button>
              </div>

              {myRequests.length === 0 ? (
                <div className="empty-state">
                  <HeartHandshake size={32} color="#d1d5db" />
                  <p style={{ fontWeight: 600, color: '#6b7280' }}>No active support requests.</p>
                  <p>Browse services to submit a confidential inquiry.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {myRequests.map((req) => (
                    <div
                      key={req.requestId}
                      style={{
                        border: '1px solid #e5e9ef',
                        borderRadius: '10px',
                        padding: '1rem 1.15rem',
                        background: req.status === 'TRIAGED' ? '#f6fef9' : '#ffffff',
                        borderLeft: req.status === 'TRIAGED' ? '3px solid #16a34a' : '3px solid var(--primary)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                            #REQ-{req.requestId}
                          </span>
                          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                            {req.service?.title}
                          </h4>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <span className={`badge badge-${req.urgencyLevel?.toLowerCase()}`}>
                            {req.urgencyLevel}
                          </span>
                          <span className={`badge badge-${req.status?.toLowerCase()}`}>
                            {req.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                        {req.description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Preferred: <strong>{req.preferredMode}</strong> • {req.preferredSchedule}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {/* If Triaged, student can book appointment slot (UC-007) */}
                          {req.status === 'TRIAGED' && (
                            <button
                              className="btn btn-sm"
                              style={{ background: '#16a34a', color: '#ffffff', fontWeight: 700 }}
                              onClick={() => { setSelectedTriagedRequest(req); setIsSlotModalOpen(true); }}
                            >
                              <Calendar size={14} />
                              <span>Schedule Appointment Slot</span>
                            </button>
                          )}

                          {/* Cancellation prompt */}
                          {(req.status === 'PENDING_REVIEW' || req.status === 'TRIAGED') && (
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleCancelRequest(req.requestId)}
                              style={{ color: '#991b1b' }}
                            >
                              <XCircle size={14} />
                              <span>Withdraw</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirmed Appointments Summary Card */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Upcoming Counseling Consultations</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    Confirmed consultation slots with assigned counselors
                  </p>
                </div>
              </div>

              {myAppointments.filter((a) => a.status === 'CONFIRMED').length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  <Calendar size={32} color="#cbd5e1" style={{ marginBottom: '0.4rem' }} />
                  <p style={{ fontSize: '0.85rem' }}>No upcoming confirmed consultations scheduled.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {myAppointments.filter((a) => a.status === 'CONFIRMED').map((appt) => (
                    <div
                      key={appt.appointmentId}
                      style={{
                        padding: '1rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        background: '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {appt.counselor?.fullName}
                          </span>
                          <span className="badge badge-scheduled">CONFIRMED</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', gap: '1rem' }}>
                          <span>📅 {appt.appointmentDate}</span>
                          <span>⏰ {appt.startTime?.substring(0, 5)} - {appt.endTime?.substring(0, 5)}</span>
                          <span>{appt.mode === 'Telehealth' ? '🌐 Telehealth' : '🏛️ ' + appt.venue}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {appt.meetingLink && (
                          <a
                            href={appt.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-primary"
                            style={{ textDecoration: 'none' }}
                          >
                            <Video size={14} />
                            <span>Join Video Call</span>
                          </a>
                        )}
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleCancelAppointment(appt.appointmentId)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Daily Habit & Mood Tracker Widget */}
          <div>
            <HabitWidget />
          </div>
        </div>
      )}

      {/* Tab 2: Wellness Services Catalog */}
      {activeTab === 'services' && (
        <div>
          {/* Filter Bar */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['ALL', 'Mental Health', 'Academic Stress', 'Nutrition & Fitness', 'Peer Support'].map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search services or topics..."
                style={{ paddingLeft: '2rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid-2">
            {filteredServices.map((service) => (
              <div key={service.serviceId} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                      }}
                    >
                      {service.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                      ● Active Intake
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {service.title}
                  </h3>

                  <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.45, marginBottom: '1rem' }}>
                    {service.description}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
                    <div><strong>Delivery Mode:</strong> {service.mode}</div>
                    <div><strong>Consultation Venue:</strong> {service.venue}</div>
                    <div><strong>Assigned Professional:</strong> {service.assignedCounselor?.fullName || 'Assigned during triage'}</div>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => { setModalSelectedService(service); setIsRequestModalOpen(true); }}
                >
                  <PlusCircle size={15} />
                  <span>Request Support in this Domain</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Appointments */}
      {activeTab === 'appointments' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>My Consultation History & Schedule</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                All scheduled, completed, and rescheduled counseling appointments
              </p>
            </div>
          </div>

          {myAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <Calendar size={40} color="#cbd5e1" style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontWeight: 600 }}>No consultation records found.</p>
              <p style={{ fontSize: '0.8rem' }}>Once your support requests are triaged, you can book consultation slots.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myAppointments.map((a) => (
                <div
                  key={a.appointmentId}
                  style={{
                    padding: '1.25rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                        {a.counselor?.fullName}
                      </span>
                      <span className={`badge badge-${a.status?.toLowerCase()}`}>
                        {a.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#475569', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                      <span>📅 Date: {a.appointmentDate}</span>
                      <span>⏰ Time: {a.startTime} – {a.endTime}</span>
                      <span>📍 Mode: {a.mode} ({a.venue})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    {a.status === 'CONFIRMED' && a.meetingLink && (
                      <a
                        href={a.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-primary"
                        style={{ textDecoration: 'none' }}
                      >
                        <Video size={14} />
                        <span>Launch Telehealth Room</span>
                      </a>
                    )}
                    {a.status === 'CONFIRMED' && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleCancelAppointment(a.appointmentId)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Resources */}
      {activeTab === 'resources' && (
        <div className="grid-3">
          {articles.map((art) => (
            <div key={art.articleId} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f1f5f9', marginBottom: '0.85rem' }}>
                  <img
                    src={art.thumbnailUrl || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80'}
                    alt={art.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--primary)',
                    background: 'var(--primary-light)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                  }}
                >
                  {art.category} • {art.readTimeMinutes} min read
                </span>
                <h3 style={{ fontSize: '1.05rem', margin: '0.5rem 0' }}>{art.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, marginBottom: '1rem' }}>
                  {art.summary}
                </p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => alert(`Article Content:\n\n${art.contentBody}`)}
                style={{ width: '100%' }}
              >
                <BookOpen size={14} />
                <span>Read Full Guide</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <RequestSupportModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        services={services}
        selectedService={modalSelectedService}
        onSuccess={loadData}
      />

      <SlotBookingModal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        request={selectedTriagedRequest}
        onSuccess={loadData}
      />

      <CrisisHotlineModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />
    </div>
  );
};

export default StudentPortal;
