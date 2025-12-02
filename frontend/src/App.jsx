import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

// Pages
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Jobs from './Pages/Jobs/Jobs';
import JobDetail from './Pages/JobDetail/JobDetail';
import Dashboard from './Pages/Dashboard/Dashboard';
import MyApplications from './Pages/MyApplications/MyApplications';
import UploadResume from './Pages/UploadResume/UploadResume';
import PostJob from './Pages/PostJob/PostJob';
import MyJobs from './Pages/MyJobs/MyJobs';
import Applicants from './Pages/Applicants/Applicants';

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
