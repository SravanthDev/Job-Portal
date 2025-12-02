# 🚀 Job Portal - Full Stack Application

A modern, full-featured job portal built with the MERN stack (MongoDB/PostgreSQL, Express, React, Node.js) that connects job seekers with recruiters. Features role-based authentication, job posting, application management, and resume uploads.

![Tech Stack](https://img.shields.io/badge/React-19.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue) ![Prisma](https://img.shields.io/badge/Prisma-6.19-brightgreen)

---

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration** - Sign up as Job Seeker or Recruiter
- **Secure Login** - JWT-based authentication
- **Role-Based Access Control** - Different permissions for job seekers and recruiters
- **Protected Routes** - Secure pages based on authentication status

### 👨‍💼 For Job Seekers
- **Browse Jobs** - View all available job listings
- **Job Search & Filter** - Find jobs by title, location, or skills
- **Job Details** - View comprehensive job descriptions
- **Apply for Jobs** - One-click application to job postings
- **My Applications** - Track all submitted applications and their status
- **Resume Upload** - Upload and manage resume (PDF, DOC, DOCX)
- **Application Status** - See if applications are Pending, Shortlisted, or Rejected
- **Personal Dashboard** - Overview of application statistics

### 🏢 For Recruiters
- **Post Jobs** - Create detailed job listings with title, description, skills, and location
- **Manage Jobs** - View, edit, and delete posted jobs
- **View Applicants** - See all candidates who applied for each job
- **Application Management** - Shortlist, reject, or reset applicant status
- **Applicant Details** - View candidate information and download resumes
- **Recruiter Dashboard** - Overview of posted jobs and applications
- **Professional UI** - Grid-based applicant cards with avatars and status badges

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - Latest React with modern hooks
- **Vite** - Lightning-fast build tool
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Framer Motion** - Smooth animations
- **React Hot Toast** - Elegant notifications
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18+ (Node 22 recommended)
- **npm** 10+
- **PostgreSQL** 14+ (or Supabase account)
- **Git** (for cloning the repository)

---

## 🚀 Getting Started

### Clone the Repository
```bash
git clone https://github.com/SravanthDev/Job-Portal.git
cd Job-Portal
```

### Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/job_portal"
DIRECT_URL="postgresql://user:password@localhost:5432/job_portal"

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Upload Directory
UPLOAD_DIR=./uploads
```

**Note:** For Supabase PostgreSQL:
- `DATABASE_URL` - Use the connection pooling URL
- `DIRECT_URL` - Use the direct connection URL

#### Generate Prisma Client & Run Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

#### Start Backend Server
```bash
npm run dev
```

The backend will start on `http://localhost:5001`

###  Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5001/api
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## 📁 Project Structure

```
Job-Portal/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & error middleware
│   ├── prisma/          # Database schema
│   ├── routes/          # API routes
│   ├── uploads/         # Resume uploads
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── Components/  # Reusable components
│   │   ├── Pages/       # Page components
│   │   ├── services/    # API service layer
│   │   ├── App.jsx      # Main app component
│   │   └── index.css    # Global styles
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (Recruiter only)
- `PUT /api/jobs/:id` - Update job (Recruiter only)
- `DELETE /api/jobs/:id` - Delete job (Recruiter only)

### Applications
- `POST /api/applications/:jobId` - Apply for job (Job Seeker only)
- `GET /api/applications/user` - Get user's applications (Job Seeker only)
- `GET /api/applications/job/:jobId` - Get job applications (Recruiter only)
- `PUT /api/applications/:applicationId/status` - Update application status (Recruiter only)

### User
- `GET /api/users/me` - Get current user profile
- `POST /api/users/upload-resume` - Upload resume URL
- `POST /api/users/upload-resume-file` - Upload resume file

---

## 📊 Database Schema

### User
- `id` - Auto-increment primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - JOB_SEEKER or RECRUITER
- `resumeUrl` - Path to uploaded resume (optional)
- `createdAt` - Timestamp

### Job
- `id` - Auto-increment primary key
- `title` - Job title
- `description` - Job description
- `skills` - Required skills (comma-separated)
- `location` - Job location
- `postedById` - Foreign key to User
- `createdAt` - Timestamp

### Application
- `id` - Auto-increment primary key
- `jobId` - Foreign key to Job
- `userId` - Foreign key to User
- `status` - PENDING, SHORTLISTED, or REJECTED
- `createdAt` - Timestamp
- **Unique constraint:** (jobId, userId) - Prevents duplicate applications

---

## 🎯 Usage Guide

### For Job Seekers
1. **Register** - Create an account with role "Job Seeker"
2. **Upload Resume** - Go to "Upload Resume" page and upload your CV
3. **Browse Jobs** - View available jobs on the Jobs page
4. **Apply** - Click on a job and hit "Apply Now"
5. **Track Applications** - Check "My Applications" to see status updates

### For Recruiters
1. **Register** - Create an account with role "Recruiter"
2. **Post Job** - Navigate to "Post a Job" and fill in details
3. **Manage Jobs** - View all your posted jobs in "My Jobs"
4. **Review Applicants** - Click on a job to see all applicants
5. **Update Status** - Shortlist or reject candidates

---

## 🔧 Available Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run build    # Generate Prisma client and run migrations
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5001
lsof -i :5001

# Kill the process
kill -9 <PID>

# Or change PORT in backend/.env
```

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL and DIRECT_URL in `.env`
- Ensure database exists: `CREATE DATABASE job_portal;`
- Run migrations: `npx prisma migrate dev`

### Prisma Issues
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset --force

# Regenerate Prisma Client
npx prisma generate
```

### Resume Upload 404
- Ensure `backend/uploads/` directory exists
- Check file permissions
- Verify UPLOAD_DIR in `.env`

### CORS Errors
- Verify FRONTEND_URL in backend `.env`
- Check VITE_API_URL in frontend `.env`
- Ensure both servers are running

---


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---
