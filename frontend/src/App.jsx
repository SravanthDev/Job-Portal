import { useState } from 'react';
import Landing from './pages/Landing/Landing.jsx';
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
    <>
      <Landing user={user} openAuth={openAuth} />
      {authModal.isOpen && (
        <Auth
          initialMode={authModal.mode}
          onSuccess={handleAuthSuccess}
          onClose={closeAuth}
        />
      )}
    </>
  );
}
