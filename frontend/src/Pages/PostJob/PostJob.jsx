import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import Card from '../../Components/Card/Card';
import Alert from '../../Components/Alert/Alert';
import './PostJob.css';

const PostJob = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skills: '',
        location: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        try {
            await jobAPI.createJob(formData);
            setMessage({ type: 'success', text: 'Job posted successfully!' });

            setTimeout(() => {
                navigate('/my-jobs');
            }, 1500);
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to post job'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-job-page">
            <div className="container">
                <Card className="post-job-card">
                    <h1>Post a New Job</h1>
                    <p className="text-muted">Fill in the details to create a new job listing</p>

                    {message.text && (
                        <Alert
                            type={message.type}
                            message={message.text}
                            onClose={() => setMessage({ type: '', text: '' })}
                        />
                    )}

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Job Title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Senior Software Engineer"
                        />

                        <div className="input-group">
                            <label className="input-label">
                                Job Description <span className="required">*</span>
                            </label>
                            <textarea
                                className="input"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Describe the role, responsibilities, and requirements"
                                rows="6"
                            />
                        </div>

                        <Input
                            label="Required Skills"
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            required
                            placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
                        />

                        <Input
                            label="Location"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g., San Francisco, CA or Remote"
                        />

                        <div className="form-actions">
                            <Button type="button" variant="secondary" onClick={() => navigate('/my-jobs')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Posting...' : 'Post Job'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default PostJob;
