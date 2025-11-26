import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing.jsx';
import JobsPage from './pages/Landing/JobsPage.jsx';
import RealJobsPage from './pages/Landing/RealJobsPage.jsx';
import CompanyProfilePage from './pages/Landing/CompanyProfilePage.jsx';
import Auth from './pages/Auth/Auth.jsx';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  function openAuth(mode) {
    setAuthModal({ isOpen: true, mode });
  }

  function closeAuth() {
    setAuthModal({ isOpen: false, mode: 'login' });
  }

  function handleAuthSuccess(userData) {
    setUser(userData);
    closeAuth();
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing user={user} openAuth={openAuth} />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/realjobs" element={<RealJobsPage />} />
        <Route path="/company/:name" element={<CompanyProfilePage />} />
      </Routes>
      {authModal.isOpen && (
        <Auth
          initialMode={authModal.mode}
          onSuccess={handleAuthSuccess}
          onClose={closeAuth}
        />
      )}
    </Router>
  );
}
