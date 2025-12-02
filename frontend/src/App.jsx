import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Jobs from './pages/Jobs/Jobs';
import JobDetail from './pages/JobDetail/JobDetail';
import Dashboard from './pages/Dashboard/Dashboard';
import MyApplications from './pages/MyApplications/MyApplications';
import UploadResume from './pages/UploadResume/UploadResume';
import PostJob from './pages/PostJob/PostJob';
import MyJobs from './pages/MyJobs/MyJobs';
import Applicants from './pages/Applicants/Applicants';

import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/jobs" element={<Jobs />} />
                            <Route path="/jobs/:id" element={<JobDetail />} />

                            {/* Protected Routes - All Authenticated Users */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Job Seeker Routes */}
                            <Route
                                path="/my-applications"
                                element={
                                    <ProtectedRoute requiredRole="JOB_SEEKER">
                                        <MyApplications />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/upload-resume"
                                element={
                                    <ProtectedRoute requiredRole="JOB_SEEKER">
                                        <UploadResume />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Recruiter Routes */}
                            <Route
                                path="/post-job"
                                element={
                                    <ProtectedRoute requiredRole="RECRUITER">
                                        <PostJob />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/my-jobs"
                                element={
                                    <ProtectedRoute requiredRole="RECRUITER">
                                        <MyJobs />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/applicants/:jobId"
                                element={
                                    <ProtectedRoute requiredRole="RECRUITER">
                                        <Applicants />
                                    </ProtectedRoute>
                                }
                            />

                            {/* 404 */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

// Simple 404 component
function NotFound() {
    return (
        <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">Go Home</a>
        </div>
    );
}

export default App;
