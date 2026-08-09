# Smart Attendance System

An AI-based attendance management system that uses face recognition to automatically mark student attendance in real time. Built with the MERN stack and face-api.js, it replaces manual registers and roll-calls with a webcam-driven recognition pipeline, while giving students their own portal to track their attendance.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas) with Mongoose ODM |
| Face Recognition | face-api.js (TensorFlow.js) — Tiny Face Detector, 68-point Landmarks, Face Recognition Net |
| Auth | JWT (Bearer token), bcrypt password hashing |
| Email | Nodemailer (Gmail SMTP) |
| Security | AES-256 encrypted biometric descriptors |

## Project Structure

```
smart-attendance-system/
├── backend/
│   ├── config/           # MongoDB connection
│   ├── controllers/      # Route logic (auth, students, attendance, reports, face)
│   ├── middleware/        # JWT auth middleware
│   ├── models/            # Mongoose schemas (User, Student, Attendance, FaceProfile)
│   ├── routes/             # API route groups
│   ├── services/           # Attendance business logic (duplicate-prevention)
│   ├── utils/               # Token generation, email sending, descriptor encryption
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/     # Shared UI (Sidebar, FaceCapture, ProtectedRoute)
        ├── pages/
        │   ├── Auth/         # Login, ChangePassword
        │   ├── Dashboard/    # Admin dashboard
        │   ├── Students/     # Student list, add student, enroll face
        │   ├── Student/      # Student-facing attendance portal
        │   ├── Attendance/   # Live recognition, attendance history
        │   └── Reports/      # Attendance summary reports
        ├── services/          # Axios API calls per feature
        ├── context/            # Auth context (JWT session)
        ├── hooks/               # useAuth hook
        └── layouts/              # MainLayout (sidebar + routed content)
```

## Key Features

- Admin-managed student enrollment — students never self-register, preventing proxy sign-ups
- Automatic login credential generation and email delivery when a student is added
- Forced password change on a student's first login
- Face enrollment via webcam — 5 reference shots averaged into one descriptor
- Biometric descriptors encrypted (AES-256) before being stored in MongoDB
- Live face recognition session that detects, matches, and auto-marks attendance
- Duplicate-attendance prevention (one record per student per day)
- Role-based routing — admins land on the console, students land on their own read-only portal
- Attendance history with date filtering
- Summary reports (total students, present/late counts)

## Database Models

| Model | Description |
|---|---|
| User | Login accounts — admin, staff, or student, with hashed passwords |
| Student | Enrolled student profiles (ID, name, email, department) |
| Attendance | Daily attendance records linked to a student, with confidence score |
| FaceProfile | Encrypted face descriptor linked to a student |

## API Routes

| Prefix | File | Description |
|---|---|---|
| `/api/auth` | `routes/authRoutes.js` | Register, login, get profile, change password |
| `/api/students` | `routes/studentRoutes.js` | Student CRUD + auto credential email |
| `/api/face-profiles` | `routes/faceRoutes.js` | Save and fetch face descriptors |
| `/api/attendance` | `routes/attendanceRoutes.js` | Record and query attendance |
| `/api/reports` | `routes/reportRoutes.js` | Attendance summary reports |

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB Atlas cluster (or local MongoDB instance)
- A Gmail account with an App Password enabled (for sending student login emails)

### 1. Clone the repository

```bash
git clone https://github.com/aashikamajhi44/smart-attendance-system.git
cd smart-attendance-system
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values — see Environment Variables below
npm run dev
```

The backend runs on `http://localhost:8002` by default.

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

### 4. Add face-api.js models

Download the following model files from the [face-api.js weights folder](https://github.com/justadudewhohacks/face-api.js/tree/master/weights) and place them in `frontend/public/models/`:

- `tiny_face_detector_model-shard1` + `-weights_manifest.json`
- `face_landmark_68_model-shard1` + `-weights_manifest.json`
- `face_recognition_model-shard1`, `-shard2` + `-weights_manifest.json`

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in all values.

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_EXPIRE` | Access token lifetime (e.g. `15m`) |
| `JWT_REFRESH_EXPIRE` | Refresh token lifetime (e.g. `7d`) |
| `FACE_MATCH_THRESHOLD` | Euclidean distance threshold for a face match (e.g. `0.45`) |
| `EMAIL_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `EMAIL_PORT` | SMTP port (e.g. `587`) |
| `EMAIL_USER` | Gmail address used to send credentials |
| `EMAIL_PASS` | Gmail App Password (not your account password) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (optional, for profile photos) |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

For the frontend, set `VITE_API_BASE_URL` in `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8002/api
```

**Never commit your `.env` files.** Both are listed in `.gitignore`.

## How Enrollment Works

1. Admin adds a student's details (name, ID, email, department).
2. The backend creates the student profile and a linked login account with an auto-generated temporary password.
3. An email is sent to the student with their login credentials.
4. Admin captures 5 face shots of the student via webcam; the averaged descriptor is encrypted and stored.
5. On the student's first login, they're required to set a new password before accessing their portal.
6. During a Live Recognition session, the camera detects faces, matches them against enrolled descriptors, and marks attendance automatically — with duplicate-prevention so a student can't be marked twice in one day.

## Security Notes

- Passwords are hashed with bcrypt; plaintext passwords are never stored.
- Face descriptors are encrypted (AES-256) before being saved to MongoDB.
- Face profile matching happens against enrolled descriptors only after JWT authentication.
- Students can only view their own attendance records, never another student's.


## License

Developed for academic and internship purposes.