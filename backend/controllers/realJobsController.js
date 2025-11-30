const axios = require('axios');
const MOCK_JOBS = require('../data/mockJobs');

// JSearch API configuration
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'jsearch.p.rapidapi.com';
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true'; // Set to 'true' to always use mock data

// Helper function to normalize job data from JSearch API
const normalizeJobData = (job) => {
    return {
        id: job.job_id || `external-${Date.now()}-${Math.random()}`,
        title: job.job_title || 'Untitled Position',
        companyName: job.employer_name || 'Unknown Company',
        companyLogo: job.employer_logo || null,
        location: job.job_city && job.job_country
            ? `${job.job_city}, ${job.job_country}`
            : job.job_country || 'Remote',
        salary: job.job_salary || job.job_min_salary && job.job_max_salary
            ? `₹${(job.job_min_salary / 100000).toFixed(1)}L - ₹${(job.job_max_salary / 100000).toFixed(1)}L`
            : 'Competitive Salary',
        description: job.job_description || 'No description available',
        applyLink: job.job_apply_link || job.job_google_link || '#',
        postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
        employmentType: job.job_employment_type || 'Full-time',
        skillsRequired: job.job_required_skills?.join(', ') || '',
        isExternal: true
    };
};

// Get real jobs from JSearch API
const getRealJobs = async (req, res) => {
    try {
        const { keyword = '', location = '', company = '', page = 1 } = req.query;

        // If mock data is enabled, return filtered mock jobs
        if (USE_MOCK_DATA) {
            console.log('Using mock data (USE_MOCK_DATA=true)');
            let filteredJobs = [...MOCK_JOBS];

            // Filter by keyword (search in title and description)
            if (keyword) {
                filteredJobs = filteredJobs.filter(job =>
                    job.job_title.toLowerCase().includes(keyword.toLowerCase()) ||
                    job.job_description.toLowerCase().includes(keyword.toLowerCase())
                );
            }

            // Filter by location
            if (location) {
                filteredJobs = filteredJobs.filter(job => {
                    const jobLocation = job.job_city && job.job_country
                        ? `${job.job_city}, ${job.job_country}`
                        : job.job_country || job.job_city || '';
                    return jobLocation.toLowerCase().includes(location.toLowerCase());
                });
            }

            // Filter by company
            if (company) {
                filteredJobs = filteredJobs.filter(job =>
                    job.employer_name.toLowerCase().includes(company.toLowerCase())
                );
            }

            const normalizedJobs = filteredJobs.map(normalizeJobData);
            return res.json(normalizedJobs);
        }

        // Build search query for real API
        let query = keyword || 'developer';
        if (location) query += ` in ${location}`;
        if (company) query += ` at ${company}`;

        const options = {
            method: 'GET',
            url: `https://${RAPIDAPI_HOST}/search`,
            params: {
                query: query,
                page: page.toString(),
                num_pages: '1',
                date_posted: 'all'
            },
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        };

        const response = await axios.request(options);

        if (!response.data || !response.data.data) {
            console.log('No data from API, using filtered mock data');
            let filteredJobs = [...MOCK_JOBS];

            // Apply same filters to mock data
            if (keyword) {
                filteredJobs = filteredJobs.filter(job =>
                    job.job_title.toLowerCase().includes(keyword.toLowerCase()) ||
                    job.job_description.toLowerCase().includes(keyword.toLowerCase())
                );
            }
            if (location) {
                filteredJobs = filteredJobs.filter(job => {
                    const jobLocation = job.job_city && job.job_country
                        ? `${job.job_city}, ${job.job_country}`
                        : job.job_country || job.job_city || '';
                    return jobLocation.toLowerCase().includes(location.toLowerCase());
                });
            }
            if (company) {
                filteredJobs = filteredJobs.filter(job =>
                    job.employer_name.toLowerCase().includes(company.toLowerCase())
                );
            }

            const normalizedJobs = filteredJobs.map(normalizeJobData);
            return res.json(normalizedJobs);
        }

        // Normalize the job data from API
        const normalizedJobs = response.data.data.map(normalizeJobData);
        res.json(normalizedJobs);
    } catch (error) {
        console.error('Error fetching real jobs:', error.message);

        // Return filtered mock data instead of error for better UX
        const { keyword = '', location = '', company = '' } = req.query;
        let filteredJobs = [...MOCK_JOBS];

        // Apply filters to mock data
        if (keyword) {
            filteredJobs = filteredJobs.filter(job =>
                job.job_title.toLowerCase().includes(keyword.toLowerCase()) ||
                job.job_description.toLowerCase().includes(keyword.toLowerCase())
            );
        }
        if (location) {
            filteredJobs = filteredJobs.filter(job => {
                const jobLocation = job.job_city && job.job_country
                    ? `${job.job_city}, ${job.job_country}`
                    : job.job_country || job.job_city || '';
                return jobLocation.toLowerCase().includes(location.toLowerCase());
            });
        }
        if (company) {
            filteredJobs = filteredJobs.filter(job =>
                job.employer_name.toLowerCase().includes(company.toLowerCase())
            );
        }

        if (error.response?.status === 429) {
            console.log('API rate limit exceeded, using filtered mock data');
        } else {
            console.log('API error, using filtered mock data');
        }

        const normalizedJobs = filteredJobs.map(normalizeJobData);
        res.json(normalizedJobs);
    }
};

// Get company profile and jobs
const getCompanyProfile = async (req, res) => {
    try {
        const { name } = req.params;

        const options = {
            method: 'GET',
            url: `https://${RAPIDAPI_HOST}/search`,
            params: {
                query: `jobs at ${name}`,
                page: '1',
                num_pages: '1'
            },
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        };

        const response = await axios.request(options);

        if (!response.data || !response.data.data || response.data.data.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        const jobs = response.data.data;
        const firstJob = jobs[0];

        // Extract company information from job listings
        const companyProfile = {
            name: firstJob.employer_name || name,
            logo: firstJob.employer_logo || null,
            website: firstJob.employer_website || null,
            description: firstJob.employer_company_type || 'No description available',
            employeeCount: 'Not specified',
            industry: 'Technology', // JSearch doesn't always provide this
            headquarters: firstJob.job_city && firstJob.job_country
                ? `${firstJob.job_city}, ${firstJob.job_country}`
                : 'Not specified',
            jobs: jobs.map(normalizeJobData)
        };

        res.json(companyProfile);
    } catch (error) {
        console.error('Error fetching company profile:', error.message);

        if (error.response?.status === 429) {
            return res.status(429).json({
                error: 'API rate limit exceeded. Please try again later.'
            });
        }

        res.status(500).json({
            error: 'Failed to fetch company profile'
        });
    }
};

module.exports = {
    getRealJobs,
    getCompanyProfile
};
