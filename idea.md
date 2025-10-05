# 💼 Simple Job Portal

## 🚀 Project Overview

**Simple Job Portal** is a clean, full-stack web application that connects **recruiters** and **job seekers** through a minimal yet powerful interface.

The goal is to build a **fully functional job platform** with real-time features, a modern UI, and a complete CRUD flow — all while keeping the architecture **simple and scalable**.

### 🎯 Objectives
- Connect recruiters and job seekers.
- Enable easy job posting, application tracking, and resume management.
- Deliver real-time updates and PDF export features for a polished user experience.

---

## 🧩 Key Features / Modules

### 1. Job Seeker Features
- 🧑‍💼 Sign up / Login  
- 📝 Create & update profile  
- 📎 Upload resume  
- 💼 Apply for jobs  
- 📊 Track application status *(Pending, Shortlisted, Rejected)*  
- 📄 Generate resume PDF from profile  

### 2. Recruiter Features
- 👨‍💻 Sign up / Login  
- 🗂️ Post new jobs *(title, description, skills, location)*  
- 📥 View applicants for each job  
- 🏷️ Update applicant status *(with real-time notifications)*  

### 3. Wow Factor Additions
- **Interactive Dashboard**
  - Recruiter: View total applicants, jobs posted, and filters.
  - Job Seeker: View applied jobs, progress, and resume stats.
- **Real-Time Notifications (via Socket.io)**
  - Instant alerts on new applications or status changes.
- **Resume PDF Generator**
  - One-click export using `html2pdf.js` or `react-to-print`.

---
```
## 👥 User Roles

| Role | Description | Permissions |
|------|--------------|-------------|
| **Admin** | Optional system owner | Manage users, monitor job postings |
| **Recruiter** | Employer / HR | Post jobs, view applicants, update statuses |
| **Job Seeker** | Candidate | Apply to jobs, manage profile, view progress |
| **Guest** | Unregistered user | Browse public job listings only |
```
---

## 💻 Frontend Page List
```

| Page | Description |
| **Home / Landing Page** | Overview of platform & job listings |
| **Login / Register Page** | Authentication & role-based access |
| **Dashboard (Job Seeker)** | Track applications, resume export |
| **Dashboard (Recruiter)** | Manage jobs & applicants |
| **Job Listings Page** | Search & view available jobs |
| **Job Details Page** | View job info & apply option |
| **Profile Page** | Manage user details, upload resume |
| **Admin Panel (Optional)** | User & site monitoring tools |
```
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

---

## 🗄️ Database Schema (Draft)
```
### **1. users**
| Field | Type | Description |

|--------|------|-------------|

| user_id (PK) | INT | Unique user ID |
| name | VARCHAR | Full name |
| email | VARCHAR | User email |
| password_hash | VARCHAR | Encrypted password |
| role | ENUM('recruiter','job_seeker','admin') | Access type |
| resume_url | VARCHAR | Uploaded resume link |
| created_at | DATETIME | Timestamp |
```
### **2. jobs**
```
| Field | Type | Description |
|--------|------|-------------|
| job_id (PK) | INT | Job ID |
| recruiter_id (FK) | INT | Posted by user_id |
| title | VARCHAR | Job title |
| description | TEXT | Full job description |
| skills_required | TEXT | Comma-separated list |
| location | VARCHAR | City / remote |
| created_at | DATETIME | Timestamp |
```

### **3. applications**
```
| Field | Type | Description |
|--------|------|-------------|
| application_id (PK) | INT | Unique application ID |
| user_id (FK) | INT | Applicant user_id |
| job_id (FK) | INT | Job being applied to |
| status | ENUM('Pending','Shortlisted','Rejected') | Application status |
| applied_at | DATETIME | Submission date |
```
---

## 🛠️ Tech Stack

### **Frontend**
- ⚛️ React.js + Tailwind CSS  
- 🔗 Axios (API communication)  
- 🧾 html2pdf.js / react-to-print *(PDF export)*  

### **Backend**
- 🟢 Node.js + Express.js  
- 📦 Multer *(File uploads)*  
- 🔔 Socket.io *(Real-time notifications)*  

### **Database**
- 🗃️ MySQL with Prisma ORM  

### **Authentication**
- 🔐 JWT (JSON Web Tokens)  
- 🔑 bcrypt (Password hashing)

### **Hosting**
- 🌐 Frontend → Vercel / Netlify  
- ⚙️ Backend → Render / Railway  
- 🛢️ Database → PlanetScale / MySQL Cloud  

---

## 🔄 Workflow (Simplified)

1. User registers / logs in → JWT authentication  
2. Recruiter posts job → Stored in MySQL  
3. Job Seeker applies → Application record created  
4. Recruiter updates status → Socket.io sends notification  
5. Job Seeker exports resume → PDF generated  
6. Dashboard → Displays analytics for both roles  

---

## 🎯 Expected Outcomes

✅ Fully functional full-stack job portal  
✅ Responsive React + Tailwind UI  
✅ Secure JWT authentication for all users  
✅ Resume PDF generator integrated with profile  
✅ Optional real-time updates via Socket.io  
✅ Modular & scalable Express backend  

---

## 🧭 Vision Beyond the Project

🚀 Future Enhancements:
- Advanced job filters *(location, skills, salary)*  
- Email / push notifications  
- Resume parsing & AI-based matching  
- Recruiter & admin analytics dashboards  
- AI integrations *(resume scoring, job matching)*  

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
