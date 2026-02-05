import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../Context/AuthContext';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import Alert from '../../Components/Alert/Alert';
import '../Register/Register.css';

import { GoogleLogin } from '@react-oauth/google';


const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();


    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleGoogleSuccess = async (response) => {
        setLoading(true);
        setError('');
        try {
            const res = await authAPI.googleLogin({
                credential: response.credential,
                role: 'JOB_SEEKER'
            });

            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Google Login Error:', err);
            setError(err.response?.data?.error || 'Google login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google Login Failed');
    };


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log('[Login] Attempting login with email:', formData.email);

        try {
            const response = await authAPI.login(formData);
            console.log('[Login] Login API response:', {
                user: response.data.user,
                hasToken: !!response.data.token,
                tokenLength: response.data.token?.length
            });

            login(response.data.user, response.data.token);
            console.log('[Login] Auth context updated, navigating to /dashboard');
            navigate('/dashboard');
        } catch (err) {
            console.error('[Login] Login failed:', err);
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="auth-page">
                <div className="container">
                    <div className="auth-card">
                        <div className="auth-sidebar">
                            <h2 className="login-sidebar-title">New to UDHYOGAM?</h2>
                            <ul className="auth-sidebar-benefits">
                                <li>One click apply using UDHYOGAM profile.</li>
                                <li>Get relevant job recommendations.</li>
                                <li>Showcase profile to top companies and consultants.</li>
                                <li>Know application status on applied jobs.</li>
                            </ul>
                            <Link to="/register" className="register-cta-btn">
                                Register for Free
                            </Link>
                            <div className="auth-sidebar-illustration">
                                <img src="https://static.naukimg.com/s/5/105/i/register.png" alt="Login illustration" />
                            </div>
                        </div>

                        <div className="auth-form-container">
                            <h1 className="auth-title">Login</h1>

                            {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                            <form onSubmit={handleSubmit}>
                                <Input
                                    label="Email ID / Username"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter Email ID / Username"
                                />

                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter Password"
                                />

                                <Button type="submit" fullWidth disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>

                                <div className="login-options">
                                    <Link to="/forgot-password" className="forgot-password-link">
                                        Forgot Password?
                                    </Link>
                                </div>

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
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
