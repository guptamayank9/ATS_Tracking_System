# Mini ATS (Applicant Tracking System)

A lightweight Applicant Tracking System to manage candidates, move them through hiring stages, search and filter them, and track hiring metrics on a dashboard.

Built as a full stack assignment with the MERN stack (MongoDB, Express, React, Node.js).

## Links

| | |
|---|---|
| Live app | `https://ats-tracking-system-1.onrender.com` |
| Backend API | `https://ats-tracking-system-j24n.onrender.com/api/` |
| Demo video | `https://drive.google.com/file/d/1iTinlV_5WTSKIWeL3cLatH8cRlSYyYFI/view?usp=sharing` |

> The backend runs on a free Render instance, so the first request after a period of inactivity can take 30 to 60 seconds while it wakes up.

## Demo Login

```
Email:    admin@ats.com
Password: admin123
```

## Features

**Authentication**
- JWT based login, with all candidate and dashboard routes protected
- Automatic redirect to the login page when the token is missing or expired

**Candidate management**
- Add, view, edit and delete candidates
- Fields: name, email, phone, role, skills, years of experience, resume link, notes
- Skills are entered as comma separated values and displayed as tags

**Hiring stages**
- Six stages: `Applied`, `Screening`, `Interview`, `Offer`, `Hired`, `Rejected`
- Change a candidate's stage from the list (dropdown) or by dragging cards on the Kanban board
- Every stage change is stored in the candidate's stage history with a timestamp

**Search and filters**
- Search by name, email, role or skill
- Filter by stage
- Filter by exact skill
- Search input is debounced (300 ms) to avoid unnecessary API calls

**Kanban board**
- One column per stage, with candidate counts
- Drag and drop to move candidates between stages
- Optimistic UI update with automatic rollback if the request fails

**Dashboard**
- Total candidates and current count per stage
- Hiring funnel showing how many candidates ever reached each stage and the conversion rate from the previous stage
- Recent activity feed with the latest 10 stage changes

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router, Axios |
| Backend | Node.js, Express (CommonJS) |
| Database | MongoDB Atlas with Mongoose |
| Auth | JWT, bcryptjs |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## Project Structure

```
ATS_Tracking_System/
├── client/
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api.js                    # Axios instance with auth interceptors
│       ├── constants.js              # Stages and stage colors
│       ├── index.css
│       ├── main.jsx
│       ├── App.jsx                   # Routes
│       ├── context/
│       │   └── AuthContext.jsx       # Login state and helpers
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── CandidateForm.jsx     # Add and edit modal
│       └── pages/
│           ├── Login.jsx
│           ├── Candidates.jsx        # List, search, filters, CRUD
│           ├── Board.jsx             # Kanban board
│           └── DashboardPage.jsx         # Metrics
└── server/
    ├── .env
    ├── index.js                      # App entry point
    ├── seed.js                       # Creates the demo admin user
    ├── seedCandidates.js             # Creates sample candidates
    ├── config/
    │   └── db.js
    ├── middleware/
    │   └── auth.js                   # JWT verification
    ├── models/
    │   ├── Candidate.js
    │   └── User.js
    ├── routes/
    │   ├── auth.js
    │   ├── candidates.js
    │   └── dashboard.js
    └── utils/
        └── escapeRegex.js            # Safe regex for search input
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB Atlas cluster (or a local MongoDB instance)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret_string
```

Create the demo admin user (run once):

```bash
node seed.js
```

Optionally load sample candidates (this deletes all existing candidates first):

```bash
node seedCandidates.js
```

Start the server:

```bash
npm run dev
```

The API runs on `http://localhost:5000`. Check `http://localhost:5000/api/health`, which should return `{ "ok": true }`.

### 3. Set up the frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:5173` and log in with the demo credentials.

> Vite reads `.env` only at startup, so restart the dev server after changing it.

## Environment Variables

**Server (`server/.env`)**

| Variable | Description |
|---|---|
| `PORT` | Port for the API server (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |

**Client (`client/.env`)**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, including `/api` |

## API Reference

All routes except `/api/auth/login` and `/api/health` require the header `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Log in with `{ email, password }`. Returns `{ token, user }` |

### Candidates

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/candidates` | List candidates. Supports `search`, `stage`, `skill`, `role` query params |
| POST | `/api/candidates` | Create a candidate |
| GET | `/api/candidates/:id` | Get a single candidate |
| PUT | `/api/candidates/:id` | Update candidate details (stage is changed through the stage endpoint) |
| PATCH | `/api/candidates/:id/stage` | Change stage with `{ stage }`. Appends to stage history |
| DELETE | `/api/candidates/:id` | Delete a candidate |

Example:

```
GET /api/candidates?search=react&stage=Interview&skill=Node.js
```

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Returns `total`, `byStage`, `funnel` and `recentActivity` |

Sample response:

```json
{
  "total": 8,
  "byStage": { "Applied": 2, "Screening": 1, "Interview": 2, "Offer": 1, "Hired": 1, "Rejected": 1 },
  "funnel": [
    { "stage": "Applied", "count": 8, "conversion": 100 },
    { "stage": "Screening", "count": 6, "conversion": 75 }
  ],
  "recentActivity": [
    { "name": "Priya Verma", "role": "Backend Developer", "stage": "Interview", "changedAt": "2026-10-18T10:30:00.000Z" }
  ]
}
```

## Data Model

**Candidate**

```js
{
  name: String,          // required
  email: String,         // required
  phone: String,
  role: String,          // required
  skills: [String],
  experience: Number,    // years
  resumeUrl: String,
  notes: String,
  stage: "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected",
  stageHistory: [{ stage, changedAt }],
  createdAt, updatedAt
}
```

**User**

```js
{ email: String (unique), password: String (hashed), name: String }
```

## Design Decisions

- **Stage history instead of a single stage field.** Storing every transition makes the funnel accurate: a candidate who was rejected after the interview still counts toward the Interview step.
- **Dedicated stage endpoint.** Stage changes go through `PATCH /:id/stage` so history is always recorded, and the general update endpoint ignores `stage` and `stageHistory`.
- **Safe search.** User input is escaped before being used in a regular expression, so characters like `(` or `*` cannot break the query.
- **Native drag and drop.** The Kanban board uses the HTML5 drag and drop API, so there is no extra dependency. The stage dropdown on the Candidates page works as a fallback on touch devices.
- **Optimistic updates.** The board updates immediately and rolls back if the API call fails.

## Deployment

**Database (MongoDB Atlas)**
1. Create a free cluster and a database user.
2. In Network Access, allow `0.0.0.0/0` so Render can connect.
3. Copy the connection string and include a database name, for example `...mongodb.net/ats?retryWrites=true&w=majority`.

**Backend (Render)**
1. Create a new Web Service from the GitHub repository.
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add the environment variables `MONGO_URI` and `JWT_SECRET`.
6. After the first deploy, run `node seed.js` once against the production database (locally with the production `MONGO_URI`, or from the Render shell) to create the demo user.

**Frontend (Vercel)**
1. Import the same repository.
2. Root directory: `client`
3. Framework preset: Vite
4. Add the environment variable `VITE_API_URL` set to `https://<your-render-service>.onrender.com/api`.
5. Add a `client/vercel.json` so page refreshes on routes like `/board` work:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

## Possible Improvements

- Pagination and sorting on the candidates list
- Resume file upload instead of a link
- Role based access (admin and recruiter) and user registration
- Notes and comments per stage
- Email notifications when a candidate moves stage
- Automated tests for the API

## Author

**Mayank Kumar Gupta**
