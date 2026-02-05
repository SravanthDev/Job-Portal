import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../Context/AuthContext';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import Alert from '../../Components/Alert/Alert';
import './Register.css';

import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'JOB_SEEKER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleGoogleSuccess = async (response) => {
        setLoading(true);
        setError('');
        try {
            const res = await authAPI.googleLogin({
                credential: response.credential,
                role: formData.role
            });

            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Google Register Error:', err);
            setError(err.response?.data?.error || 'Google registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google Registration Failed');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { name, email, password, role } = formData;
            const response = await authAPI.register({ name, email, password, role });

            login(response.data.user, response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-card">
                    <div className="auth-sidebar">
                        <h2 className="auth-sidebar-title">On registering, you can</h2>
                        <ul className="auth-sidebar-benefits">
                            <li>Build your profile and let recruiters find you</li>
                            <li>Get job postings delivered right to your email</li>
                            <li>Find a job and grow your career</li>
                        </ul>
                        <div className="auth-sidebar-illustration">
                            <img src="https://static.naukimg.com/s/5/105/i/register.png" alt="Register illustration" />
                        </div>
                    </div>

                    <div className="auth-form-container">
                        <h1 className="auth-title">Create your UDHYOGAM profile</h1>
                        <p className="auth-subtitle">Search & apply to jobs from India's No.1 Job Site</p>

                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Full name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="What is your name?"
                            />

                            <Input
                                label="Email ID"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Tell us your Email ID"
                            />

                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="(Minimum 6 characters)"
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Re-enter password"
                            />

                            <div className="input-group">
                                <label className="input-label">Work status <span className="required">*</span></label>
                                <div className="role-select">
                                    <label className="role-option">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="RECRUITER"
                                            checked={formData.role === 'RECRUITER'}
                                            onChange={handleChange}
                                        />
                                        <div className="role-option-icon"></div>
                                        <div className="role-option-content">
                                            <span className="role-option-title">Recruiter</span>
                                            <span className="role-option-desc">post jobs</span>
                                        </div>
                                    </label>
                                    <label className="role-option">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="JOB_SEEKER"
                                            checked={formData.role === 'JOB_SEEKER'}
                                            onChange={handleChange}
                                        />
                                        <div className="role-option-icon"></div>
                                        <div className="role-option-content">
                                            <span className="role-option-title">Job Seeker</span>
                                            <span className="role-option-desc">apply for jobs</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <Button type="submit" fullWidth disabled={loading}>
                                {loading ? 'Creating Account...' : 'Register now'}
                            </Button>

                            <div className="auth-divider">
                                <span>Or</span>
                            </div>

                            <div className="google-login-container" style={{ display: 'flex', justifyContent: 'center' }}>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                    text="signup_with"
                                />
                            </div>
                        </form>

                        <p className="auth-link">
                            Already have an account? <Link to="/login">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
