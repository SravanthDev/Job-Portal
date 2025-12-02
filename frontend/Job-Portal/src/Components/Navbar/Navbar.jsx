import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, isJobSeeker, isRecruiter, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <div className="navbar-left">
                    <Link to="/" className="navbar-brand">
                        <span className="brand-text">UDHYOGAM</span>
                    </Link>
                    <Link to="/jobs" className="nav-link browse-jobs">Browse Jobs</Link>

                    {isRecruiter && (
                        <>
                            <Link to="/post-job" className="nav-link">Post Job</Link>
                            <Link to="/my-jobs" className="nav-link">My Jobs</Link>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        </>
                    )}

                    {isJobSeeker && (
                        <>
                            <Link to="/my-applications" className="nav-link">My Applications</Link>
                            <Link to="/upload-resume" className="nav-link">Upload Resume</Link>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        </>
                    )}
                </div>

                <div className="navbar-right">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="login-link">Login</Link>
                            <Link to="/register" className="register-link">Register</Link>
                        </>
                    ) : (
                        <div className="user-info">
                            <span className="user-name">{user?.name}</span>
                            <Button size="small" variant="secondary" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
