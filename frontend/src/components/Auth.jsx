import { useEffect, useState } from 'react';
import './auth.css';

const API = '/api/auth';

export default function Auth({ initialMode = 'login', onSuccess, navigate }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'job_seeker' });
  const [error, setError] = useState('');
  const isRegister = mode === 'register';

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API}/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      localStorage.setItem('token', data.token);
      onSuccess?.(data.user);
      navigate?.('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-container">
      <div className="switcher">
        <button className={`tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Login</button>
        <button className={`tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>Signup</button>
      </div>
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
        <button type="submit">{isRegister ? 'Create account' : 'Login'}</button>
        {error && <div className="error">{error}</div>}
      </form>
      </div>
    </div>
  );
}


