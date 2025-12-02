import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../Context/AuthContext';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import Alert from '../../Components/Alert/Alert';
import '../Register/Register.css';

// Login Page Component
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login(formData);
            login(response.data.user, response.data.token);
            navigate('/dashboard');
        } catch (err) {
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
                        {/* Left Sidebar - Benefits and Register CTA */}
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

                        {/* Right Side - Login Form */}
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

                                <button type="button" className="google-signin-btn-full">
                                    <span style={{ fontSize: '18px', marginRight: '8px' }}>G</span>
                                    Sign in with Google
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
