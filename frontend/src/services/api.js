import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ==================== AUTH ====================

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data)
};

// ==================== USERS ====================

export const userAPI = {
    getProfile: () => api.get('/users/me'),
    uploadResume: (resumeUrl) => api.post('/users/upload-resume', { resumeUrl }),
    uploadResumeFile: (formData) => api.post('/users/upload-resume-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
};

// ==================== JOBS ====================

export const jobAPI = {
    getAllJobs: () => api.get('/jobs'),
    getJobById: (id) => api.get(`/jobs/${id}`),
    createJob: (data) => api.post('/jobs', data),
    updateJob: (id, data) => api.put(`/jobs/${id}`, data),
    deleteJob: (id) => api.delete(`/jobs/${id}`)
};

// ==================== APPLICATIONS ====================

export const applicationAPI = {
    applyForJob: (jobId) => api.post(`/applications/${jobId}`),
    getUserApplications: () => api.get('/applications/user'),
    getJobApplications: (jobId, status) => {
        const params = status ? { status } : {};
        return api.get(`/applications/job/${jobId}`, { params });
    },
    updateApplicationStatus: (applicationId, status) =>
        api.put(`/applications/${applicationId}/status`, { status })
};

export default api;
