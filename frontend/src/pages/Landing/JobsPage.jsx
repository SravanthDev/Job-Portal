import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import JobCard from '../../components/common/JobCard';
import AutocompleteInput from '../../components/common/AutocompleteInput';
import './JobsPage.css';

// Sample suggested jobs when database is empty
const SUGGESTED_JOBS = [
    {
        id: 'sample-1',
        title: 'Senior Full Stack Developer',
        description: 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will work on cutting-edge technologies and build scalable web applications.',
        location: 'Bangalore, India',
        skillsRequired: 'React, Node.js, MongoDB',
        createdAt: new Date().toISOString(),
        recruiter: { name: 'Tech Innovations Pvt Ltd' }
    },
    {
        id: 'sample-2',
        title: 'Frontend Developer',
        description: 'Join our team as a Frontend Developer and create beautiful, responsive user interfaces. Work with modern frameworks and collaborate with designers.',
        location: 'Remote',
        skillsRequired: 'React, TypeScript, CSS',
        createdAt: new Date().toISOString(),
        recruiter: { name: 'Digital Solutions Inc' }
    },
    {
        id: 'sample-3',
        title: 'Backend Engineer',
        description: 'We need a skilled Backend Engineer to design and implement robust APIs and microservices. Experience with cloud platforms is a plus.',
        location: 'Hyderabad, India',
        skillsRequired: 'Node.js, Express, PostgreSQL',
        createdAt: new Date().toISOString(),
        recruiter: { name: 'Cloud Systems Ltd' }
    },
    {
        id: 'sample-4',
        title: 'DevOps Engineer',
        description: 'Looking for a DevOps Engineer to automate deployment pipelines and manage cloud infrastructure. Strong knowledge of CI/CD required.',
        location: 'Pune, India',
        skillsRequired: 'Docker, Kubernetes, AWS',
        createdAt: new Date().toISOString(),
        recruiter: { name: 'Infrastructure Pro' }
    },
    {
        id: 'sample-5',
        title: 'UI/UX Designer',
        description: 'Creative UI/UX Designer needed to design intuitive and engaging user experiences. Portfolio showcasing mobile and web designs required.',
        location: 'Mumbai, India',
        skillsRequired: 'Figma, Adobe XD, Prototyping',
        createdAt: new Date().toISOString(),
        recruiter: { name: 'Design Studio Co' }
    },
    {
        id: 'sample-6',
        title: 'Data Scientist',
        description: 'Join our data team as a Data Scientist. Analyze large datasets, build predictive models, and derive actionable insights for business growth.',
        location: 'Delhi, India',
        skillsRequired: 'Python, Machine Learning, SQL',
        createdAt: new Date().toISOString(),
        recruiter: { name: 'Analytics Corp' }
    }
];

// Popular cities in India
const CITY_SUGGESTIONS = [
    'Bangalore, India',
    'Mumbai, India',
    'Delhi, India',
    'Hyderabad, India',
    'Pune, India',
    'Chennai, India',
    'Kolkata, India',
    'Ahmedabad, India',
    'Gurgaon, India',
    'Noida, India',
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
    'Vue.js',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'AWS',
    'Docker',
    'Kubernetes',
    'Express',
    'Django',
    'Spring Boot',
    'Machine Learning',
    'Data Science',
    'DevOps',
    'CI/CD',
    'Git',
    'REST API',
    'GraphQL',
    'Microservices'
];

// Popular companies
const COMPANY_SUGGESTIONS = [
    'Tech Innovations Pvt Ltd',
    'Digital Solutions Inc',
    'Cloud Systems Ltd',
    'Infrastructure Pro',
    'Design Studio Co',
    'Analytics Corp',
    'Google',
    'Microsoft',
    'Amazon',
    'Flipkart',
    'Swiggy',
    'Zomato',
    'Paytm',
    'PhonePe',
    'CRED',
    'Razorpay',
    'Freshworks',
    'Zoho',
    'Infosys',
    'TCS',
    'Wipro',
    'HCL'
];

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        skillsRequired: '',
        company: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query params
            const params = new URLSearchParams();
            if (filters.keyword) params.append('keyword', filters.keyword);
            if (filters.location) params.append('location', filters.location);
            if (filters.skillsRequired) params.append('skillsRequired', filters.skillsRequired);
            if (filters.company) params.append('company', filters.company);

            const response = await axiosClient.get(`/jobs?${params.toString()}`);

            // If no jobs from database, show suggested jobs
            if (response.data.length === 0) {
                setJobs(SUGGESTED_JOBS);
            } else {
                setJobs(response.data);
            }
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to load jobs. Showing suggested jobs instead.');
            // Show suggested jobs on error
            setJobs(SUGGESTED_JOBS);
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
        fetchJobs();
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
                    <h1 className="jobs-title">Browse Jobs</h1>
                    <p className="jobs-subtitle">Discover your next career opportunity</p>
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
                            label="Skills"
                            name="skillsRequired"
                            value={filters.skillsRequired}
                            onChange={handleFilterChange}
                            placeholder="Required skills"
                            suggestions={SKILL_SUGGESTIONS}
                        />
                    </div>

                    <div className="filters-grid" style={{ marginTop: '16px' }}>
                        <AutocompleteInput
                            label="Company"
                            name="company"
                            value={filters.company}
                            onChange={handleFilterChange}
                            placeholder="Company name"
                            suggestions={COMPANY_SUGGESTIONS}
                        />
                        <div></div>
                        <div></div>
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

                {/* Jobs Grid - Always show jobs */}
                <div className="jobs-grid">
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobsPage;
