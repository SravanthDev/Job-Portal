import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Signup from "./Pages/Auth/signup";
import Login from "./Pages/Auth/login";
import JobSeekerDashboard from "./Pages/JobSeeker/JobSeekerDashboard";
import JobDetails from "./Pages/JobSeeker/JobDetails";
import SavedJobs from "./Pages/JobSeeker/SavedJobs";
import Profile from "./Pages/JobSeeker/UserProfile";
import ProtectedRoute from "./routes/ProtectedRoute";
import EmployerDashboard from "./Pages/Employer/EmployerDashboard";
import JobPostingForm from "./Pages/Employer/JobPostingForm";
import ManageJobs from "./Pages/Employer/ManageJob";
import ApplicantionViewer from "./Pages/Employer/ApplicationViewer";
import EmployerProfilePage from "./Pages/Employer/EmployerProfilePage";
const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />}/>
                    <Route path="/signup" element={<Signup />}/>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/find-jobs" element={<JobSeekerDashboard />}/>
                    <Route path="/job/:jobId" element={<JobDetails />}/>
                    <Route path = "/saved-jobs" element={<SavedJobs />}/>
                    <Route path = "/profile" element={<Profile />}/>

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute requiredRole="employer"/>}/>
                    <Route path = "/employer-dashboard" element={<EmployerDashboard />}/>
                    <Route path="/post-job" element={<JobPostingForm/>}/>
                    <Route path="/manage-jobs" element={<ManageJobs/>}/>
                    <Route path="/applicants" element={<ApplicantionViewer/>}/>
                    <Route path="/company-profile" element={<EmployerProfilePage/>}/>



                    {/* Catch all route*/}
                    <Route path="*" element={<Navigate to="/" replace/>}/>

                </Routes>
            </Router>
            <Toaster
            toastOptions={{
                className :"",
                style:{
                    fontSize: "13px",
                    
                }
            }}
            />
        </div>
    );
};

export default App;