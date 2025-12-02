import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from '../../services/api';
import Card from '../../Components/Card/Card';
import './MyApplications.css';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await applicationAPI.getUserApplications();
            setApplications(response.data.applications);
        } catch (err) {
            console.error('Failed to load applications', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { class: 'status-pending', label: '⏳ Pending' },
            SHORTLISTED: { class: 'status-shortlisted', label: '✅ Shortlisted' },
            REJECTED: { class: 'status-rejected', label: '❌ Rejected' }
        };
        return statusMap[status] || statusMap.PENDING;
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '60px 24px' }}>
                <p className="text-center">Loading applications...</p>
            </div>
        );
    }

    return (
        <div className="my-applications-page">
            <div className="container">
                <h1>My Applications</h1>
                <p className="text-muted">{applications.length} total applications</p>

                {applications.length === 0 ? (
                    <Card>
                        <p className="text-center">You haven't applied to any jobs yet</p>
                    </Card>
                ) : (
                    <div className="applications-list">
                        {applications.map((application) => (
                            <Card key={application.id} className="application-card">
                                <div className="application-header">
                                    <div>
                                        <h3
                                            className="application-title"
                                            onClick={() => navigate(`/jobs/${application.job.id}`)}
                                        >
                                            {application.job.title}
                                        </h3>
                                        <p className="text-muted">
                                            Posted by {application.job.postedBy.name}
                                        </p>
                                    </div>
                                    <span className={`status-badge ${getStatusBadge(application.status).class}`}>
                                        {getStatusBadge(application.status).label}
                                    </span>
                                </div>

                                <p className="application-location">📍 {application.job.location}</p>

                                <p className="application-date">
                                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                                </p>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
