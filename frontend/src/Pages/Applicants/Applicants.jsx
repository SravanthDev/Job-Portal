import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI, jobAPI } from '../../services/api';
import Button from '../../Components/Button/Button';
import Card from '../../Components/Card/Card';
import Alert from '../../Components/Alert/Alert';
import './Applicants.css';

const Applicants = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchApplicants();
    }, [jobId]);

    const fetchApplicants = async () => {
        try {
            const [jobResponse, applicantsResponse] = await Promise.all([
                jobAPI.getJobById(jobId),
                applicationAPI.getJobApplications(jobId)
            ]);

            setJob(jobResponse.data.job);
            setApplicants(applicantsResponse.data.applications);
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to load applicants'
            });
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (applicationId, status) => {
        try {
            await applicationAPI.updateApplicationStatus(applicationId, status);
            setMessage({ type: 'success', text: `Application ${status.toLowerCase()} successfully!` });
            fetchApplicants();
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to update status'
            });
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { class: 'status-pending', label: 'Pending' },
            SHORTLISTED: { class: 'status-shortlisted', label: 'Shortlisted' },
            REJECTED: { class: 'status-rejected', label: 'Rejected' }
        };
        return statusMap[status] || statusMap.PENDING;
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '60px 24px' }}>
                <p className="text-center">Loading applicants...</p>
            </div>
        );
    }

    return (
        <div className="applicants-page">
            <div className="container">
                <Button variant="secondary" onClick={() => navigate('/my-jobs')}>
                    ← Back to My Jobs
                </Button>

                {job && (
                    <div className="job-info">
                        <h1>{job.title}</h1>
                        <p className="text-muted">
                            {applicants.length} total applicants • Posted on {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                )}

                {message.text && (
                    <Alert
                        type={message.type}
                        message={message.text}
                        onClose={() => setMessage({ type: '', text: '' })}
                    />
                )}

                {applicants.length === 0 ? (
                    <Card>
                        <p className="text-center">No applicants yet</p>
                    </Card>
                ) : (
                    <div className="applicants-list">
                        {applicants.map((application) => (
                            <Card key={application.id} className="applicant-card">
                                <div className="applicant-header">
                                    <div className="applicant-info">
                                        <h3>{application.user.name}</h3>
                                        <p className="text-muted">{application.user.email}</p>
                                    </div>
                                    <span className={`status-badge ${getStatusBadge(application.status).class}`}>
                                        {getStatusBadge(application.status).label}
                                    </span>
                                </div>

                                <div className="applicant-details">
                                    <p>
                                        <strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}
                                    </p>
                                    {application.user.resumeUrl ? (
                                        <p>
                                            <strong>Resume:</strong>{' '}
                                            <a
                                                href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${application.user.resumeUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="resume-download-link"
                                            >
                                                📥 View/Download Resume
                                            </a>
                                        </p>
                                    ) : (
                                        <p>
                                            <strong>Resume:</strong> <span className="text-muted">Not uploaded</span>
                                        </p>
                                    )}
                                </div>

                                <div className="applicant-actions">
                                    <Button
                                        size="small"
                                        variant="success"
                                        onClick={() => updateStatus(application.id, 'SHORTLISTED')}
                                        disabled={application.status === 'SHORTLISTED'}
                                    >
                                        ✅ Shortlist
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="danger"
                                        onClick={() => updateStatus(application.id, 'REJECTED')}
                                        disabled={application.status === 'REJECTED'}
                                    >
                                        ❌ Reject
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="secondary"
                                        onClick={() => updateStatus(application.id, 'PENDING')}
                                        disabled={application.status === 'PENDING'}
                                    >
                                        ↩️ Reset
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

export default Applicants;
