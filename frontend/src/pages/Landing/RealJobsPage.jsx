import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import AutocompleteInput from '../../components/common/AutocompleteInput';
import './JobsPage.css';

// Popular cities
const CITY_SUGGESTIONS = [
    'Bangalore, India',
    'Mumbai, India',
    'Delhi, India',
    'Hyderabad, India',
    'Pune, India',
    'Chennai, India',
    'Remote',
    'Work from Home'
];

// Popular tech skills
const SKILL_SUGGESTIONS = [
    'React',
    'Node.js',
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'Angular',
    'Vue.js'
];

// Popular companies
const COMPANY_SUGGESTIONS = [
    'Google',
    'Microsoft',
    'Amazon',
    'Apple',
    'Meta',
    'Netflix',
    'Tesla',
    'Uber'
];

const RealJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        keyword: 'developer',
        location: '',
        company: ''
    });

    useEffect(() => {
        fetchRealJobs();
    }, []);

    const fetchRealJobs = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (filters.keyword) params.append('keyword', filters.keyword);
            if (filters.location) params.append('location', filters.location);
            if (filters.company) params.append('company', filters.company);

            const response = await axiosClient.get(`/realjobs?${params.toString()}`);
            setJobs(response.data);
        } catch (err) {
            console.error('Error fetching real jobs:', err);
            setError(err.response?.data?.error || 'Failed to load jobs. Please try again later.');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRealJobs();
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

    return (
        <div className="jobs-page">
            <div className="jobs-container">
                <div className="jobs-header">
                    <h1 className="jobs-title">Real Jobs from Top Companies</h1>
                    <p className="jobs-subtitle">Discover opportunities from leading employers worldwide</p>
                </div>

                {/* Search Filters */}
                <form onSubmit={handleSearch} className="filters-container">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label htmlFor="keyword" className="filter-label">
                                Keyword
                            </label>
                            <input
                                type="text"
                                id="keyword"
                                name="keyword"
                                value={filters.keyword}
                                onChange={handleFilterChange}
                                placeholder="Job title or description"
                                className="filter-input"
                            />
                        </div>

                        <AutocompleteInput
                            label="Location"
                            name="location"
                            value={filters.location}
                            onChange={handleFilterChange}
                            placeholder="City or remote"
                            suggestions={CITY_SUGGESTIONS}
                        />

                        <AutocompleteInput
                            label="Company"
                            name="company"
                            value={filters.company}
                            onChange={handleFilterChange}
                            placeholder="Company name"
                            suggestions={COMPANY_SUGGESTIONS}
                        />
                    </div>

                    <button type="submit" className="search-button">
                        Search Jobs
                    </button>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Jobs Grid */}
                {jobs.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-state-text">
                            No jobs found. Try different search criteria or check your API key configuration.
                        </p>
                    </div>
                ) : (
                    <div className="jobs-grid">
                        {jobs.map((job) => (
                            <div key={job.id} className="job-card">
                                <div className="job-card-top">
                                    <div className="job-card-left">
                                        <h3 className="job-title">{job.title}</h3>
                                        <Link
                                            to={`/company/${encodeURIComponent(job.companyName)}`}
                                            className="job-company company-link"
                                        >
                                            {job.companyName}
                                        </Link>
                                    </div>
                                    <div className="job-card-right">
                                        {job.companyLogo ? (
                                            <img
                                                src={job.companyLogo}
                                                alt={job.companyName}
                                                className="job-company-logo-img"
                                            />
                                        ) : (
                                            <div className="job-company-logo">
                                                {job.companyName[0]}
                                            </div>
                                        )}
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
                )}
            </div>
        </div>
    );
};

export default RealJobsPage;
