# Smart Task & Habit Tracker

A polished, responsive task and habit tracker prototype built with the MEAN stack. The application supports protected access, task/habit CRUD operations, dark mode-friendly styling, progress indicators, and responsive Tailwind UI.

## 🧱 Project Structure

```text
smart-task-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   ├── components/
│   │   │   │   └── dashboard/
│   │   │   │       ├── dashboard.component.htm
│   │   │   │       └── dashboard.component.ts
│   │   │   ├── services/
│   │   │   │   └── api.service.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB running locally or a MongoDB Atlas URI
- Angular CLI installed globally if you want `ng` commands available

### Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### Configure backend

Create a `.env` file inside `backend/` with the following values if you want MongoDB persistence:

```env
MONGO_URI=mongodb://127.0.0.1:27017/smart-task-tracker
PORT=5000
```

If MongoDB is unavailable, the backend still starts in local fallback mode.

### Run locally

```bash
cd backend
npm run dev

# in another terminal
cd frontend
npm start
```

Then open `http://localhost:4200`.

### Login
- Username: any value
- Password: `password`

## 🧠 AI tools used
- AI helped generate the initial project structure and infer the BE/FE architecture.
- AI assisted with writing Express route handlers and Angular standalone component logic.
- AI helped align the README and project commands with the actual codebase.

## 🤖 Where AI helped
- scaffolding the backend controllers and routes
- generating the frontend standalone component and Tailwind-based layout
- defining the API service contract and TypeScript interfaces
- writing the README documentation and setup commands

## 👷 What was implemented manually
- tying the app to the real backend route structure
- ensuring the frontend build config and tsconfig were valid
- refining UI behavior for filtering, progress, and responsive layout
- verifying the backend health endpoint and local run process

## ⚠️ Challenges faced
- keeping the app consistent while migrating from the earlier mock service to a real API service
- handling Angular CLI path issues in this Windows environment
- ensuring the backend started even when MongoDB was unavailable

## 🚀 Future improvements
- add real MongoDB Atlas persistence and JWT authentication
- add user registration and per-user data isolation
- implement a history dashboard with charts and streak tracking
- add server-side validation and stronger error handling
- support task categories, due dates, and calendar reminders

## 📝 Notes
- The app is designed to work with a simple dummy login.
- The backend is currently prepared for MongoDB but can fallback if the connection is not available.
