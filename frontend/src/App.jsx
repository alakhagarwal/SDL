import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import NotificationDrawer from './components/NotificationDrawer';
import LoginPage from './pages/LoginPage';
import StudentPortal from './pages/StudentPortal';
import CounselorPortal from './pages/CounselorPortal';
import HealthCenterPortal from './pages/HealthCenterPortal';
import AdminPortal from './pages/AdminPortal';

const AppContent = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          color: '#8c1616',
        }}
      >
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Student Wellness Portal</div>
        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Connecting to Institutional Care Services...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {role === 'STUDENT' && <StudentPortal />}
        {role === 'COUNSELOR' && <CounselorPortal />}
        {role === 'HEALTH_CENTER' && <HealthCenterPortal />}
        {role === 'ADMIN' && <AdminPortal />}
      </main>
      <NotificationDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}
