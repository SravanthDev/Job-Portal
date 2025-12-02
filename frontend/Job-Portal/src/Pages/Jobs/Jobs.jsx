import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import './Jobs.css';

// Jobs Page Component - Shows all available jobs
const Jobs = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch jobs when component mounts
    useEffect(() => {
        fetchJobs();
    }, []);

    // Fetch jobs from API
    const fetchJobs = async () => {
        try {
            const response = await jobAPI.getAllJobs();
            setJobs(response.data.jobs);
        } catch (err) {
            setError('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '60px 24px' }}>
                <p className="text-center">Loading jobs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: '60px 24px' }}>
                <p className="text-center" style={{ color: '#EF4444' }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="jobs-page">
            <div className="container">
                <div className="page-header">
                    <h1>Browse Jobs</h1>
                    <p className="text-muted">{jobs.length} jobs available</p>
                </div>

                {jobs.length === 0 ? (
                    <Card>
                        <p className="text-center">No jobs available at the moment</p>
                    </Card>
                ) : (
                    <div className="jobs-grid">
                        {jobs.map((job) => (
                            <Card key={job.id} className="job-card" hover>
                                <div className="job-header">
                                    <h3>{job.title}</h3>
                                    <span className="job-location">📍 {job.location}</span>
                                </div>

                                <p className="job-description">
                                    {job.description.substring(0, 150)}
                                    {job.description.length > 150 ? '...' : ''}
                                </p>

                                <div className="job-skills">
                                    {job.skills.split(',').slice(0, 3).map((skill, index) => (
                                        <span key={index} className="skill-tag">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>

                                <div className="job-footer">
                                    <div className="job-meta">
                                        <span className="posted-by">By {job.postedBy.name}</span>
                                        <span className="text-muted">
                                            {job._count.applications} applicants
                                        </span>
                                    </div>
                                    <Button size="small" onClick={() => navigate(`/jobs/${job.id}`)}>
                                        View Details
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

export default Jobs;
