import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { useAuth } from '../../Context/AuthContext';
import Button from '../../Components/Button/Button';
import Card from '../../Components/Card/Card';
import Alert from '../../Components/Alert/Alert';
import './UploadResume.css';

const UploadResume = () => {
    const { updateUser, user } = useAuth();
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(selectedFile.type)) {
                setMessage({ type: 'error', text: 'Please upload a PDF or DOC file' });
                return;
            }

            if (selectedFile.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'File size must be less than 5MB' });
                return;
            }

            setFile(selectedFile);
            setMessage({ type: '', text: '' });
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage({ type: 'error', text: 'Please select a file' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('resume', file);

            const response = await userAPI.uploadResumeFile(formData);
            updateUser(response.data.user);

            setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
            setFile(null);

            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to upload resume'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-resume-page">
            <div className="container">
                <Card className="upload-card">
                    <h1>Upload Your Resume</h1>
                    <p className="text-muted">Upload your resume to apply for jobs</p>

                    {user?.resumeUrl && (
                        <div className="current-resume">
                            <p><strong>Current Resume:</strong></p>
                            <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer">
                                View Current Resume
                            </a>
                        </div>
                    )}

                    {message.text && (
                        <Alert
                            type={message.type}
                            message={message.text}
                            onClose={() => setMessage({ type: '', text: '' })}
                        />
                    )}

                    <form onSubmit={handleUpload}>
                        <div className="file-input-container">
                            <label className="file-label">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="file-input"
                                />
                                <span className="file-button">Choose File</span>
                            </label>

                            {file && (
                                <div className="file-info">
                                    <p><strong>Selected:</strong> {file.name}</p>
                                    <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                            )}
                        </div>

                        <div className="upload-info">
                            <p> Accepted formats: PDF, DOC, DOCX</p>
                            <p> Maximum size: 5MB</p>
                        </div>

                        <div className="form-actions">
                            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading || !file}>
                                {loading ? 'Uploading...' : 'Upload Resume'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default UploadResume;
