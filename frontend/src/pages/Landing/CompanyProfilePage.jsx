import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import '../Landing/JobsPage.css';

const CompanyProfilePage = () => {
    const { name } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCompanyProfile();
    }, [name]);

    const fetchCompanyProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosClient.get(`/realjobs/company/${encodeURIComponent(name)}`);
            setCompany(response.data);
        } catch (err) {
            console.error('Error fetching company profile:', err);
            setError('Failed to load company profile. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="jobs-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="jobs-page">
                <div className="jobs-container">
                    <div className="error-message">{error || 'Company not found'}</div>
                    <Link to="/realjobs" className="search-button" style={{ display: 'inline-block', marginTop: '20px' }}>
                        Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="jobs-page">
            <div className="jobs-container">
                {/* Company Header */}
                <div className="company-header">
                    <Link to="/realjobs" className="back-link">
                        ← Back to Jobs
                    </Link>

                    <div className="company-header-content">
                        <div className="company-logo-large">
                            {company.logo ? (
                                <img src={company.logo} alt={company.name} />
                            ) : (
                                <div className="company-logo-placeholder">
                                    {company.name[0]}
                                </div>
                            )}
                        </div>

                        <div className="company-info">
                            <h1 className="company-name">{company.name}</h1>

                            <div className="company-meta">
                                {company.website && (
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="company-website"
                                    >
                                        🌐 Visit Website
                                    </a>
                                )}
                                <span className="company-location">📍 {company.headquarters}</span>
                                <span className="company-industry">🏢 {company.industry}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Company Description */}
                {company.description && (
                    <div className="company-section">
                        <h2 className="section-title">About {company.name}</h2>
                        <p className="company-description">{company.description}</p>
                    </div>
                )}

                {/* Jobs Section */}
                <div className="company-section">
                    <h2 className="section-title">
                        Open Positions ({company.jobs?.length || 0})
                    </h2>

                    {company.jobs && company.jobs.length > 0 ? (
                        <div className="jobs-grid">
                            {company.jobs.map((job) => (
                                <div key={job.id} className="job-card">
                                    <div className="job-card-top">
                                        <div className="job-card-left">
                                            <h3 className="job-title">{job.title}</h3>
                                            <p className="job-company">{job.companyName}</p>
                                        </div>
                                    </div>

                                    <div className="job-meta">
                                        {job.location && (
                                            <div className="job-meta-item">
                                                <svg className="job-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                <span>{job.location}</span>
                                            </div>
                                        )}
                                        <div className="job-meta-item">
                                            <svg className="job-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{job.employmentType}</span>
                                        </div>
                                    </div>

                                    <p className="job-description">{job.description}</p>

                                    <div className="job-card-footer">
                                        <div className="job-footer-left">
                                            <span className="job-salary">{job.salary}</span>
                                            <span className="job-date">
                                                Posted {new Date(job.postedDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="job-footer-right">
                                            <a
                                                href={job.applyLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="apply-now-button"
                                            >
                                                Apply Now →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state-text">No open positions at the moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyProfilePage;
