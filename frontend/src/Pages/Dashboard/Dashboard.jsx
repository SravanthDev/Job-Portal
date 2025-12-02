import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { applicationAPI, jobAPI } from '../../services/api';
import Card from '../../Components/Card/Card';
import './Dashboard.css';

const Dashboard = () => {
    const { user, isJobSeeker, isRecruiter } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            if (isJobSeeker) {
                const response = await applicationAPI.getUserApplications();
                setStats(response.data.stats);
            } else if (isRecruiter) {
                const response = await jobAPI.getAllJobs();
                const myJobs = response.data.jobs.filter(job => job.postedBy.id === user.id);
                const totalApplications = myJobs.reduce((sum, job) => sum + job._count.applications, 0);
                setStats({
                    totalJobs: myJobs.length,
                    totalApplications
                });
            }
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
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
                                <a href="/jobs" className="action-link">Browse Jobs</a>
                                <a href="/my-applications" className="action-link">View Applications</a>
                            </div>
                        </Card>
                    )}

                    {isRecruiter && (
                        <Card>
                            <h3>Quick Actions</h3>
                            <div className="action-buttons">
                                <a href="/post-job" className="action-link">Post New Job</a>
                                <a href="/my-jobs" className="action-link">Manage Jobs</a>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
