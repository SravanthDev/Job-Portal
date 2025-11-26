import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    // Get first letter of company name for logo
    const companyInitial = (job.recruiter?.name || 'C')[0].toUpperCase();

    // Split skills into tags
    const skillTags = job.skillsRequired
        ? job.skillsRequired.split(',').map(s => s.trim()).slice(0, 3)
        : [];

    return (
        <div className="job-card">
            <div className="job-card-top">
                <div className="job-card-left">
                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-company">
                        <svg className="job-company-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {job.recruiter?.name || 'Company'}
                    </p>
                </div>
                <div className="job-card-right">
                    <div className="job-company-logo">
                        {companyInitial}
                    </div>
                </div>
            </div>

            <div className="job-meta">
                {job.location && (
                    <div className="job-meta-item">
                        <svg className="job-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{job.location}</span>
                    </div>
                )}
                <div className="job-meta-item">
                    <svg className="job-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Full Time</span>
                </div>
            </div>

            {skillTags.length > 0 && (
                <div className="job-tags">
                    {skillTags.map((skill, index) => (
                        <span key={index} className="job-tag">{skill}</span>
                    ))}
                </div>
            )}

            <p className="job-description">
                {job.description}
            </p>

            <div className="job-card-footer">
                <div className="job-footer-left">
                    <span className="job-salary">
                        Competitive Salary
                    </span>
                    <span className="job-date">
                        Posted {new Date(job.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>
                <div className="job-footer-right">
                    <Link
                        to={`/jobs/${job.id}`}
                        className="view-details-button"
                    >
                        Details
                    </Link>
                    <button className="apply-now-button">
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
