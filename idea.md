



# 💼 Job Portal

## 🚀 Project Overview

**Job Portal** is a clean, full-stack web application built to connect **recruiters** and **job seekers** through an intuitive and efficient interface.  

The project aims to deliver a fully functional job platform featuring a **modern UI**, **real-time interactions**, and complete **CRUD operations** for users, jobs, and applications. The focus is on maintaining a **simple, scalable architecture** that’s easy to extend and deploy for real-world use.

### Objectives
- Connect recruiters and job seekers efficiently.
- Simplify job posting, application tracking, and resume management.
- Provide real-time updates and PDF export for a smooth user experience.

---

## Key Features

### 1. Job Seeker Features
- Sign up / Login  
- Create and update profile  
- Upload resume  
- Apply for jobs  
- Track application status (Pending, Shortlisted, Rejected)  
- Generate resume PDF from profile  

### 2. Recruiter Features
- Sign up / Login  
- Post new jobs (title, description, skills, location)  
- View applicants for each job  
- Update applicant status with real-time notifications  

### 3. Additional Features
- **Interactive Dashboard**
  - Recruiter: Overview of total applicants, jobs posted, and filtering options.
  - Job Seeker: Track applied jobs, application progress, and resume stats.
- **Real-Time Notifications**
  - Instant alerts for new applications or status updates.
- **Resume PDF Export**
  - Generate resumes with one click using `html2pdf.js` or `react-to-print`.


---
## 👥 User Roles

| **Role** | **Description** | **Permissions** |
|-----------|------------------|-----------------|
| **Admin** | Optional system owner | Manage users, monitor job postings |
| **Recruiter** | Employer / HR | Post jobs, view applicants, update statuses |
| **Job Seeker** | Candidate | Apply to jobs, manage profile, view progress |
| **Guest** | Unregistered user | Browse public job listings only |

---

## Pages Overview


| **Page** | **Description** |
|-----------|-----------------|
| **Home / Landing Page** | Overview of platform & job listings |
| **Login / Register Page** | Authentication & role-based access |
| **Dashboard (Job Seeker)** | Track applications, resume export |
| **Dashboard (Recruiter)** | Manage jobs & applicants |
| **Job Listings Page** | Search & view available jobs |
| **Job Details Page** | View job info & apply option |
| **Profile Page** | Manage user details, upload resume |
| **Admin Panel (Optional)** | User & site monitoring tools |

---

## 📁 Project Structure
```
job-portal-simple/
│
├── client/ 
│ ├── src/
│ │ ├── components/
│ │ ├── pages/ 
│ │ ├── services/
│ │ └── App.js
│
├── server/ 
│ ├── config/
│ ├── controllers/ 
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── utils/s
│ └── server.js│
├── database/
│ └── schema.sql
│
└── README.md
```

![WhatsApp Image 2025-11-01 at 12 43 12 AM](https://github.com/user-attachments/assets/fa3d1fdc-2ec2-489e-87cb-4f478fb67e3c)

---

### **1. Users Table**

| **Field** | **Type** | **Description** |
|------------|-----------|-----------------|
| `user_id` (PK) | `INT` | Unique user ID |
| `name` | `VARCHAR` | Full name |
| `email` | `VARCHAR` | User email |
| `password_hash` | `VARCHAR` | Encrypted password |
| `role` | `ENUM('recruiter', 'job_seeker', 'admin')` | Access type |
| `resume_url` | `VARCHAR` | Uploaded resume link |
| `created_at` | `DATETIME` | Timestamp |


### **2. Jobs Table**

| **Field** | **Type** | **Description** |
|------------|-----------|-----------------|
| `job_id` (PK) | `INT` | Job ID |
| `recruiter_id` (FK) | `INT` | Posted by `user_id` |
| `title` | `VARCHAR` | Job title |
| `description` | `TEXT` | Full job description |
| `skills_required` | `TEXT` | Comma-separated list |
| `location` | `VARCHAR` | City / remote |
| `created_at` | `DATETIME` | Timestamp |


### **3. Applications Table**

| **Field** | **Type** | **Description** |
|------------|-----------|-----------------|
| `application_id` (PK) | `INT` | Unique application ID |
| `user_id` (FK) | `INT` | Applicant `user_id` |
| `job_id` (FK) | `INT` | Job being applied to |
| `status` | `ENUM('Pending', 'Shortlisted', 'Rejected')` | Application status |
| `applied_at` | `DATETIME` | Submission date |

---

## 🛠️ Tech Stack

### Frontend
- React.js with Tailwind CSS for a responsive UI  
- Axios for API communication  
- html2pdf.js / react-to-print for PDF export  

### Backend
- Node.js with Express.js  
- Multer for file uploads  
- Socket.io for real-time notifications  

### Database
- MySQL using Prisma ORM  

### Authentication
- JWT (JSON Web Tokens) for secure authentication  
- bcrypt for password hashing  

### Hosting
- Frontend: Vercel / Netlify  
- Backend: Render / Railway  
- Database: PlanetScale / MySQL Cloud  

---

## Workflow

A simple overview of how users interact with the system:

1. **User Registration / Login** – Users sign up or log in and are authenticated using JWT.  
2. **Job Posting** – Recruiters create and post jobs, which are stored in the MySQL database.  
3. **Job Application** – Job seekers apply to jobs, creating application records in the database.  
4. **Status Updates** – Recruiters update application statuses, and real-time notifications are sent via Socket.io.  
5. **Resume Export** – Job seekers can generate and download their resumes as PDFs.  
6. **Dashboard Analytics** – Both recruiters and job seekers can view dashboards showing relevant statistics and progress.


---

## Expected Outcomes
- A fully functional full-stack job portal  
- Responsive and user-friendly UI using React and Tailwind  
- Secure authentication and password management  
- Resume PDF generator integrated with user profiles  
- Real-time updates for application status  
- Modular and scalable backend design  

---

## Future Enhancements
- Advanced job filters (location, skills, salary)  
- Email and push notifications  
- Resume parsing and AI-based job matching  
- Detailed analytics dashboards for recruiters and admins  
- AI-driven features like resume scoring and job recommendations  


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/job-portal-simple.git
cd job-portal-simple
```
2️⃣ Setup Backend
```
cd server
npm install
npm start
```
3️⃣ Setup Frontend
```
cd ../client
npm install
npm start
```
Frontend runs on: http://localhost:3000

Backend runs on: http://localhost:5000

📈 ***Project Goals***
Build a scalable job platform,
Learn full-stack integration,
Implement CRUD operations,
Add real-time and export features.

