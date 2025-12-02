import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import { useAuth } from '../../Context/AuthContext';
import Button from '../../Components/Button/Button';
import Card from '../../Components/Card/Card';
import Alert from '../../Components/Alert/Alert';
import './MyJobs.css';

const MyJobs = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const response = await jobAPI.getAllJobs();
            const myJobs = response.data.jobs.filter(job => job.postedBy.id === user.id);
            setJobs(myJobs);
        } catch (err) {
            console.error('Failed to load jobs', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) {
            return;
        }

        try {
            await jobAPI.deleteJob(jobId);
            setMessage({ type: 'success', text: 'Job deleted successfully!' });
            fetchMyJobs();
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to delete job'
            });
        }
    };

    const viewApplicants = (jobId) => {
        navigate(`/applicants/${jobId}`);
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '60px 24px' }}>
                <p className="text-center">Loading your jobs...</p>
            </div>
        );
    }

    return (
        <div className="my-jobs-page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1>My Posted Jobs</h1>
                        <p className="text-muted">{jobs.length} jobs posted</p>
                    </div>
                    <Button onClick={() => navigate('/post-job')}>
                        + Post New Job
                    </Button>
                </div>

                {message.text && (
                    <Alert
                        type={message.type}
                        message={message.text}
                        onClose={() => setMessage({ type: '', text: '' })}
                    />
                )}

                {jobs.length === 0 ? (
                    <Card className="empty-jobs-card">
                        <p className="text-center">You haven't posted any jobs yet</p>
                    </Card>
                ) : (
                    <div className="jobs-list">
                        {jobs.map((job) => (
                            <Card key={job.id} className="job-item-card">
                                <div className="job-item-header">
                                    <div>
                                        <h3>{job.title}</h3>
                                        <p className="text-muted">📍 {job.location}</p>
                                    </div>
                                    <div className="applicants-badge">
                                        {job._count.applications} applicants
                                    </div>
                                </div>

                                <p className="job-item-description">
                                    {job.description.substring(0, 150)}...
                                </p>

                                <p className="job-item-date">
                                    Posted on {new Date(job.createdAt).toLocaleDateString()}
                                </p>

                                <div className="job-item-actions">
                                    <Button size="small" onClick={() => viewApplicants(job.id)}>
                                        View Applicants
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="secondary"
                                        onClick={() => navigate(`/jobs/${job.id}`)}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="danger"
                                        onClick={() => handleDelete(job.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyJobs;
