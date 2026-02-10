import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../../services/api';
import { useAuth } from '../../Context/AuthContext';
import Button from '../../Components/Button/Button';
import Card from '../../Components/Card/Card';
import Alert from '../../Components/Alert/Alert';
import './JobDetail.css';

const JobDetail = () => {
    const { id } = useParams();
    const { isJobSeeker, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const response = await jobAPI.getJobById(id);
            setJob(response.data.job);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load job details' });
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setApplying(true);
        try {
            await applicationAPI.applyForJob(id);
            setHasApplied(true);
            setMessage({ type: 'success', text: 'Application submitted successfully!' });
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to apply for job'
            });
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '60px 24px' }}>
                <p className="text-center">Loading job details...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="container" style={{ padding: '60px 24px' }}>
                <p className="text-center">Job not found</p>
            </div>
        );
    }

    return (
        <div className="job-detail-page">
            <div className="container">
                <Button variant="secondary" onClick={() => navigate('/jobs')}>
                    ← Back to Jobs
                </Button>

                <Card className="job-detail-card">
                    {message.text && (
                        <Alert
                            type={message.type}
                            message={message.text}
                            onClose={() => setMessage({ type: '', text: '' })}
                        />
                    )}

                    <div className="job-detail-header">
                        <div>
                            <h1>{job.title}</h1>
                            <p className="job-location">📍 {job.location}</p>
                        </div>
                        {isJobSeeker && (
                            <Button onClick={handleApply} disabled={applying || hasApplied} size="large">
                                {hasApplied ? 'Applied' : applying ? 'Applying...' : 'Apply Now'}
                            </Button>
                        )}
                    </div>

                    <div className="job-detail-section">
                        <h3>About the Role</h3>
                        <p>{job.description}</p>
                    </div>

                    <div className="job-detail-section">
                        <h3>Required Skills</h3>
                        <div className="skills-list">
                            {job.skills.split(',').map((skill, index) => (
                                <span key={index} className="skill-badge">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="job-detail-section">
                        <h3>Company Information</h3>
                        <p><strong>Recruiter:</strong> {job.postedBy.name}</p>
                        <p><strong>Email:</strong> {job.postedBy.email}</p>
                    </div>

                    <div className="job-detail-section">
                        <p className="text-muted">
                            Posted on {new Date(job.createdAt).toLocaleDateString()} •
                            {job._count.applications} applicants
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default JobDetail;
