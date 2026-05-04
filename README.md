# Taskboard

A team task management web app where admins create projects, manage members, assign tasks, and track progress — while members view assigned tasks, update statuses, and see project activity.

## Live URL

> _Add your Railway deployment URL here after deploying._

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Frontend       | React (Vite), Tailwind CSS, DM Sans, Axios      |
| Backend        | Node.js, Express.js, Mongoose                   |
| Database       | MongoDB Atlas                                   |
| Authentication | Firebase Authentication (Email/Password)         |
| Auth Validation| firebase-admin SDK (backend token verification) |
| Deployment     | Railway                                         |

## Features

- **Authentication** — Signup/Login with Firebase, JWT token verification on every request
- **Role-Based Access Control** — Admin and Member roles with different permissions
- **Project Management** — Create, update, delete projects; add/remove members
- **Task Management** — Create, assign, update status, delete tasks with priority and due dates
- **Dashboard** — Metric cards (total projects, tasks, open tasks, overdue), needs-attention section, project progress summary, recent activity feed
- **Deadline Alert System** — Overdue (red) and Due Soon (amber) labels on tasks with past or near due dates
- **Per-Project Progress Tracker** — Visual progress bar based on task completion percentage, powered by a backend stats endpoint
- **Activity Logging** — Every mutation (task create/update/delete, member add/remove, project create/delete) is logged with timestamps
- **Team Management** — Admin-only page to view all users and change roles
- **Responsive Design** — Sidebar collapses to hamburger menu on mobile

## Local Setup

### Prerequisites

- Node.js >= 18
- MongoDB Atlas cluster (free tier)
- Firebase project with Email/Password auth enabled

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd taskboard
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Fill in your .env values:
#   PORT=5000
#   MONGODB_URI=<your-mongodb-atlas-connection-string>
#   FIREBASE_PROJECT_ID=<your-firebase-project-id>
#   FIREBASE_CLIENT_EMAIL=<your-firebase-service-account-email>
#   FIREBASE_PRIVATE_KEY=<your-firebase-private-key>
npm install
npm start
```

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
# Fill in your .env values:
#   VITE_API_BASE_URL=http://localhost:5000/api
#   VITE_FIREBASE_API_KEY=<your-firebase-api-key>
#   VITE_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
#   VITE_FIREBASE_PROJECT_ID=<your-firebase-project-id>
#   VITE_FIREBASE_APP_ID=<your-firebase-app-id>
npm install
npm run dev
```

### 4. First user

The first user to sign up is automatically assigned the **admin** role. All subsequent users get **member** by default.

## Deployment (Railway)

1. Create a MongoDB Atlas cluster and get the connection string
2. Create a Firebase project, enable Email/Password auth, get web SDK config and service account key
3. Push `backend/` and `frontend/` to a GitHub repo
4. On Railway:
   - **Backend service**: point to `backend/` folder, set env vars, start command `node server.js`
   - **Frontend service**: point to `frontend/` folder, build command `npm run build`, start command `npx serve dist -p $PORT`
   - Set `VITE_API_BASE_URL` to the Railway backend URL before building frontend

## API Reference

| Method | Endpoint                          | Auth     | Description                          |
| ------ | --------------------------------- | -------- | ------------------------------------ |
| GET    | `/api/health`                     | None     | Health check                         |
| POST   | `/api/auth/register`              | Token    | Create/sync user after Firebase signup |
| GET    | `/api/auth/me`                    | Token    | Get current user profile             |
| GET    | `/api/projects`                   | Token    | List user's projects                 |
| POST   | `/api/projects`                   | Admin    | Create project                       |
| GET    | `/api/projects/:id`               | Token    | Get project detail                   |
| PUT    | `/api/projects/:id`               | Admin    | Update project                       |
| DELETE | `/api/projects/:id`               | Admin    | Delete project + tasks + logs        |
| POST   | `/api/projects/:id/members`       | Admin    | Add member by email                  |
| DELETE | `/api/projects/:id/members/:uid`  | Admin    | Remove member                        |
| GET    | `/api/projects/:id/stats`         | Token    | Get project task statistics          |
| GET    | `/api/tasks`                      | Token    | List tasks (filterable)              |
| POST   | `/api/tasks`                      | Admin    | Create task                          |
| GET    | `/api/tasks/:id`                  | Token    | Get task detail                      |
| PUT    | `/api/tasks/:id`                  | Token    | Update task (member: status only)    |
| DELETE | `/api/tasks/:id`                  | Admin    | Delete task                          |
| GET    | `/api/users`                      | Admin    | List all users                       |
| PUT    | `/api/users/:id/role`             | Admin    | Change user role                     |
| GET    | `/api/activity`                   | Token    | Get activity logs (filterable)       |

## Screenshots

> _Add screenshots of your deployed app here._
