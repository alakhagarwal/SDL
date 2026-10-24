import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  Shield,
  Lock,
  Mail,
  User,
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  LifeBuoy
} from 'lucide-react';

const LoginPage = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [role, setRole] = useState('STUDENT');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          fullName,
          email,
          password,
          role,
          rollNumber: role === 'STUDENT' ? rollNumber : null,
          department,
        });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Authentication failed. Please verify your institutional credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f8fafc',
      }}
    >
      {/* Top University Utility Bar */}
      <div
        style={{
          background: '#560a13',
          color: '#fecdd3',
          padding: '0.45rem 1.5rem',
          fontSize: '0.78rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={13} color="#fecdd3" />
            <span style={{ fontWeight: 600 }}>The LNM Institute of Information Technology, Jaipur</span>
            <span style={{ opacity: 0.6 }}>•</span>
            <span style={{ opacity: 0.85 }}>Deemed-to-be-University</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
            <span>Campus Health Center: +91 141 2688000</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>National Tele-MANAS: 14416 (Toll-Free 24x7)</span>
          </div>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1.05fr 1fr',
          }}
        >
          {/* Left Hero Panel - LNMIIT Institutional Care Showcase */}
          <div
            style={{
              background: 'linear-gradient(145deg, #8b1523 0%, #4c070e 100%)',
              color: '#ffffff',
              padding: '3rem 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <div>
              {/* Brand Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#ffffff',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  <HeartPulse size={26} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                    Student Wellness Portal
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: '#fecdd3', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                    Center for Counseling & Psychological Support
                  </p>
                </div>
              </div>

              {/* Mission Statement */}
              <h3 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: '1rem' }}>
                Fostering Mental Health, Resilience & Academic Excellence
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#fed7aa', lineHeight: 1.55, marginBottom: '2rem' }}>
                A confidential, conflict-free institutional sanctuary providing students with professional psychological counseling, atomic slot scheduling, daily self-care habit analytics, and 24/7 campus crisis escalation.
              </p>

              {/* Key Pillars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={14} color="#ffffff" />
                  </div>
                  <span style={{ fontSize: '0.84rem', color: '#ffffff' }}>Strict Patient Confidentiality & Encrypted Records</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={14} color="#ffffff" />
                  </div>
                  <span style={{ fontSize: '0.84rem', color: '#ffffff' }}>Certified Clinical Psychologists & Faculty Counselors</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={14} color="#ffffff" />
                  </div>
                  <span style={{ fontSize: '0.84rem', color: '#ffffff' }}>Instant Telehealth Rooms & SAC In-Person Consultation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={14} color="#ffffff" />
                  </div>
                  <span style={{ fontSize: '0.84rem', color: '#ffffff' }}>Emergency Campus Medical Center Referral Desk</span>
                </div>
              </div>
            </div>

            {/* Helpline Footer Strip */}
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <LifeBuoy size={20} color="#fecdd3" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.76rem', lineHeight: 1.35, color: '#ffffff' }}>
                <strong>Immediate Campus Assistance:</strong> Dial extension <strong>5191700</strong> from hostel intercoms or visit the SAC ground floor medical unit.
              </div>
            </div>
          </div>

          {/* Right Authentication Form Panel */}
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Form Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border)',
                marginBottom: '1.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => { setIsRegister(false); setErrorMsg(null); }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: 'none',
                  background: 'none',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: !isRegister ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: !isRegister ? '2.5px solid var(--primary)' : 'none',
                }}
              >
                Institutional Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setErrorMsg(null); }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: 'none',
                  background: 'none',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: isRegister ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: isRegister ? '2.5px solid var(--primary)' : 'none',
                }}
              >
                New Account Registration
              </button>
            </div>

            {errorMsg && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#991b1b',
                  fontSize: '0.82rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {isRegister && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Alakh Agarwal"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Institutional Category / Role</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="STUDENT">Student (Undergraduate / Postgraduate)</option>
                      <option value="COUNSELOR">Wellness Counselor / Clinical Staff</option>
                      <option value="HEALTH_CENTER">Campus Medical Officer (Health Center)</option>
                      <option value="ADMIN">Dean of Student Affairs Office (Admin)</option>
                    </select>
                  </div>

                  {role === 'STUDENT' && (
                    <div className="form-group">
                      <label className="form-label">Student Roll Number</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 24UCS001"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Department / School</label>
                    <select
                      className="form-select"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                      <option value="Mechanical-Mechatronics Engineering">Mechanical-Mechatronics Engineering</option>
                      <option value="Physics & Mathematics">Physics & Mathematics</option>
                      <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">
                  Institutional Email Address
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 400, marginLeft: '0.4rem' }}>
                    (@lnmiit.ac.in)
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="username@lnmiit.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Password</label>
                  {!isRegister && (
                    <span style={{ fontSize: '0.74rem', color: 'var(--primary)', cursor: 'pointer' }}>
                      Forgot Password?
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.92rem' }}
                disabled={loading}
              >
                <span>{loading ? 'Validating Credentials...' : isRegister ? 'Complete Registration' : 'Sign In to Portal'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Shield size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span>
                Protected under institutional directory access. Use your official LNMIIT email address to sign in.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* University Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          background: '#ffffff',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          fontSize: '0.76rem',
          color: '#64748b',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div>
            © The LNM Institute of Information Technology, Jaipur • Rupa ki Nangal, Post-Sumel, Jamdoli, Jaipur, Rajasthan 302031
          </div>
          <div style={{ marginTop: '0.25rem', color: '#94a3b8' }}>
            Office of Dean of Student Affairs • CS314 Software Development Laboratory
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
