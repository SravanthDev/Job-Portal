import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { applicationAPI, jobAPI } from '../../services/api';
import Card from '../../Components/Card/Card';
import './Dashboard.css';

const Dashboard = () => {
    const { user, isJobSeeker, isRecruiter } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Debug logging
    console.log('[Dashboard] Rendering with user:', {
        userId: user?.id,
        userName: user?.name,
        userRole: user?.role,
        isJobSeeker,
        isRecruiter
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            console.log('[Dashboard] Fetching data for role:', user?.role);

            if (isJobSeeker) {
                const response = await applicationAPI.getUserApplications();
                console.log('[Dashboard] Job seeker stats:', response.data.stats);
                setStats(response.data.stats);
            } else if (isRecruiter) {
                const response = await jobAPI.getAllJobs();
                const myJobs = response.data.jobs.filter(job => job.postedBy.id === user.id);
                const totalApplications = myJobs.reduce((sum, job) => sum + job._count.applications, 0);
                const recruiterStats = {
                    totalJobs: myJobs.length,
                    totalApplications
                };
                console.log('[Dashboard] Recruiter stats:', recruiterStats);
                setStats(recruiterStats);
            } else {
                console.warn('[Dashboard] User has no valid role:', user?.role);
                setError('Invalid user role. Please contact support.');
            }
        } catch (err) {
            console.error('[Dashboard] Failed to fetch dashboard data:', err);
            setError(err.response?.data?.error || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '60px 24px' }}>
                <p className="text-center">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: '60px 24px' }}>
                <div style={{
                    backgroundColor: '#fee',
                    border: '1px solid #fcc',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: '#c33' }}>Error Loading Dashboard</h3>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '10px',
                            padding: '10px 20px',
                            cursor: 'pointer'
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome back, {user?.name}!</h1>
                        <p className="text-muted">
                            {isJobSeeker ? 'Track your job applications' : 'Manage your job postings'}
                        </p>
                    </div>
                </div>

                <div className="stats-grid">
                    {isJobSeeker && stats && (
                        <>
                            <Card className="stat-card">
                                <div className="stat-content">
                                    <h3>{stats.total}</h3>
                                    <p>Total Applications</p>
                                </div>
                            </Card>

                            <Card className="stat-card">
                                <div className="stat-content">
                                    <h3>{stats.pending}</h3>
                                    <p>Pending</p>
                                </div>
                            </Card>

                            <Card className="stat-card stat-success">
                                <div className="stat-content">
                                    <h3>{stats.shortlisted}</h3>
                                    <p>Shortlisted</p>
                                </div>
                            </Card>

                            <Card className="stat-card stat-danger">
                                <div className="stat-content">
                                    <h3>{stats.rejected}</h3>
                                    <p>Rejected</p>
                                </div>
                            </Card>
                        </>
                    )}

                    {isRecruiter && stats && (
                        <>
                            <Card className="stat-card">

                                <div className="stat-content">
                                    <h3>{stats.totalJobs}</h3>
                                    <p>Total Jobs Posted</p>
                                </div>
                            </Card>

                            <Card className="stat-card">

                                <div className="stat-content">
                                    <h3>{stats.totalApplications}</h3>
                                    <p>Total Applications</p>
                                </div>
                            </Card>
                        </>
                    )}
                </div>

                <div className="dashboard-actions">
                    {isJobSeeker && (
                        <Card>
                            <h3>Quick Actions</h3>
                            <div className="action-buttons">
                                <Link to="/jobs" className="action-link">Browse Jobs</Link>
                                <Link to="/my-applications" className="action-link">View Applications</Link>
                            </div>
                        </Card>
                    )}

                    {isRecruiter && (
                        <Card>
                            <h3>Quick Actions</h3>
                            <div className="action-buttons">
                                <Link to="/post-job" className="action-link">Post New Job</Link>
                                <Link to="/my-jobs" className="action-link">Manage Jobs</Link>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
