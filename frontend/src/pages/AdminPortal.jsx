import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminPortal = () => {
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/audit-logs'),
    ])
      .then(([statsRes, logsRes]) => {
        setStats(statsRes.data);
        setAuditLogs(logsRes.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="main-layout">
      {/* Admin Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
          borderRadius: '16px',
          padding: '2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px -5px rgba(30, 27, 75, 0.3)',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#a5b4fc' }}>
          <span>System Administration & Institutional Governance</span>
        </div>
        <h2 style={{ fontSize: '1.85rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.35rem' }}>
          Campus Wellness Governance & Audit Dashboard
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#c7d2fe', maxWidth: '650px', lineHeight: 1.4 }}>
          Aggregate institutional operational metrics and tamper-evident audit log trail of clinical decisions and administrative activities.
        </p>
      </div>

      {/* Aggregate Institutional Metrics Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ borderTop: '3px solid #2563eb' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            {stats?.totalUsers || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
            Registered Users
          </div>
        </div>

        <div className="card" style={{ borderTop: '3px solid #8c1616' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#8c1616', marginBottom: '0.2rem' }}>
            {stats?.totalRequests || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
            Total Support Requests
          </div>
        </div>

        <div className="card" style={{ borderTop: '3px solid #059669' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            {stats?.totalAppointments || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
            Consultations Scheduled
          </div>
        </div>

        <div className="card" style={{ borderTop: '3px solid #7c3aed' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            {stats?.activeServices || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
            Active Wellness Services
          </div>
        </div>
      </div>

      {/* Immutable Audit Log Table (NFR-007) */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>System-Wide Immutable Audit Trail</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Permanent record of clinical triage decisions, booking confirmations, emergency escalations, and system actions
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>ID</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>Action Type</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>Actor</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>Entity</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>Details</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.auditId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>#{log.auditId}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: log.actionType.includes('EMERGENCY') ? '#fee2e2' : log.actionType.includes('TRIAGE') ? '#eff6ff' : '#f1f5f9',
                        color: log.actionType.includes('EMERGENCY') ? '#8c1616' : log.actionType.includes('TRIAGE') ? '#1e40af' : '#475569',
                      }}
                    >
                      {log.actionType}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                    {log.actorUser ? `${log.actorUser.fullName} (${log.actorUser.role})` : 'System'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                    {log.targetEntity} #{log.entityId}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>
                    {log.details}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.78rem' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
