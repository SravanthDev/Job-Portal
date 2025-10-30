import { useState } from 'react';
import './App.css';

const API = '/api/auth'; // adjust if needed for proxy

function AuthForm({ mode, onAuth, error }) {
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'job_seeker' });
  const isRegister = mode === 'register';

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    onAuth(form);
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {isRegister && (
        <>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="job_seeker">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </>
      )}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

function App() {
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  async function handleAuth(form) {
    setError('');
    try {
      const res = await fetch(`${API}/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Auth failed');
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  if (user) {
    return (
      <div className="welcome">
        <h2>Welcome, {user.name || user.email}!</h2>
        <p>Role: {user.role}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="switcher">
        <button onClick={() => { setMode('login'); setError(''); }} disabled={mode==='login'}>Login</button>
        <button onClick={() => { setMode('register'); setError(''); }} disabled={mode==='register'}>Register</button>
      </div>
      <AuthForm mode={mode} onAuth={handleAuth} error={error} />
    </div>
  );
}

export default App;
