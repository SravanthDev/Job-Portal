## Job Portal

A simple full‑stack Job Portal with a Node.js/Express backend, Prisma ORM (MySQL), and a React + Vite frontend. Users can register/login and the data is persisted via Prisma models (`User`, `Job`, `Application`).

### Features
- **Authentication**: Register and login endpoints using JWT.
- **Data Models**: `User`, `Job`, and `Application` managed via Prisma.
- **Prisma Studio**: Explore and edit your DB in the browser.

---

## Prerequisites
- Node.js 18+ (Node 22 works as well)
- npm 10+
- MySQL 8+ running locally

---

## 1) Clone and install dependencies
```bash
git clone <your-repo-url>
cd Job-Portal
npm install
```

---

## 2) Configure environment
Create a `.env` file at the repository root:
```env
DATABASE_URL="mysql://root:password@localhost:3306/job-portal"
PORT=3002
JWT_SECRET=some_test_secret
```

Notes:
- Update the MySQL user/password/host/port/database to match your local setup.
- The backend reads env vars from the root `.env`.

---

## 3) Generate Prisma Client and set up the DB
```bash
# Generate client
npx prisma generate --schema backend/prisma/schema.prisma

# For a fresh dev database, create tables from schema
npx prisma migrate dev --schema backend/prisma/schema.prisma --name init

# If Prisma reports drift and you want to reset dev DB
npx prisma migrate reset --schema backend/prisma/schema.prisma --force
```

Optional: Open Prisma Studio
```bash
npx prisma studio --schema backend/prisma/schema.prisma
```

---

## 4) Run the backend
From the project root:
```bash
npm run dev
# Server will start on PORT from .env (default 3002)
```

Health check:
```bash
curl -sS http://localhost:3002/
# {"ok": true}
```

Common port issues:
```bash
lsof -i :3002
kill -9 <PID>
npm run dev
```

---

## 5) Run the frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Vite will print a local URL such as `http://localhost:5173`. The frontend can call the backend at `http://localhost:3002` (adjust if you change the port).

---

## API Overview (short)
- `POST /api/auth/register` – body: `{ name, email, password, role }`
- `POST /api/auth/login` – body: `{ email, password }`

On success, both return a JWT token and basic user info.

---

## Scripts (root)
- `npm run dev` – start the backend

## Scripts (frontend)
- `npm run dev` – start the Vite dev server
- `npm run build` – production build
- `npm run preview` – preview built app

---

## Troubleshooting
- EPERM/EADDRINUSE on port 3002: ensure only one server is running; use `lsof -i :3002` then `kill -9 <PID>` and restart. You can also change `PORT` in `.env`.
- Prisma drift or missing tables: run `npx prisma migrate dev` or `npx prisma migrate reset --force` for a clean dev database.
