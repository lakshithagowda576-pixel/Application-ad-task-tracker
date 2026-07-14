# Smart Task & Habit Tracker

A polished, responsive task and habit tracking prototype built with the MEAN stack. The application includes a dummy login gate, task and habit CRUD flows, completion toggles, and a modern Tailwind-powered dashboard.

## 🧱 Project Structure

```text
smart-task-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── itemController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── Item.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── itemRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   └── components/
│   │   │       └── dashboard/
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
├── package.json
└── README.md
```

## ⚙️ Setup Commands

```bash
# From the workspace root
npm install -g @angular/cli

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## ▶️ Running the Application

```bash
# Backend
cd backend
npm run dev

# Frontend (separate terminal)
cd frontend
npm start
```

Use any username and the password `password` to access the dashboard.

## 🧠 AI Reflections

- AI tools were used to scaffold the project structure, propose the dashboard layout, and generate the initial Express and Angular implementation.
- The human developer finalized the architecture, validated the user flow, and ensured the prototype remained fully functional and self-contained.
- One challenge was balancing the requested dummy authentication with a production-ready-looking UX while keeping the project easy to run locally.

## 🚀 Future Improvements

- Replace the mock API with real MongoDB-backed services and JWT authentication.
- Add historical charts, streak tracking, and reminders.
- Introduce drag-and-drop organization and filtering by status or type.

## 📝 Sample Git History

```text
feat: scaffold smart task tracker backend
feat: add auth and task CRUD endpoints
feat: build responsive dashboard with Tailwind UI
refactor: connect dashboard to mock API layer
docs: add setup and architecture guidance
```
