# 📦 Product Dashboard (Full-Stack Technical Test)

A full-stack product dashboard built for an Associate Software Engineer technical assessment.

## 🧭 Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Environment Variables](#-environment-variables)
- [Run Locally](#-run-locally)
- [Linting and Tests](#-linting-and-tests)
- [API Routes](#-api-routes)
- [CI/CD and Deployment](#-cicd-and-deployment)
- [Author](#-author)

## 🧠 Overview

- Frontend: React + TypeScript + Zustand (Vite)
- Backend: Node.js (ESM) + Express + MySQL
- Auth: JWT stored in HTTP-only cookies
- CI: GitHub Actions
- Deploy:
  - Frontend: Vercel
  - Backend: Render

## ✨ Features

- Authentication (register/login/logout/current user)
- Product CRUD (create/edit/delete) behind auth
- Search + filtering + pagination on the dashboard

## 🛠️ Tech Stack

**Frontend**

- React, TypeScript, React Router
- Zustand state management
- Tailwind CSS + MUI components
- Jest + React Testing Library

**Backend**

- Node.js + Express
- MySQL (`mysql2`)
- JWT (`jsonwebtoken`) + bcrypt

**DevOps**

- GitHub Actions
- Vercel (frontend)
- Render (backend)
- Clever Cloud (database)

## 🗂️ Repository Structure

```text
.
├─ frontend/
│  ├─ src/
│  ├─ public/
│  └─ package.json
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  └─ server.js
│  └─ package.json
└─ .github/
   └─ workflows/
      └─ ci.yml
```

## 🔐 Environment Variables

### Frontend (`frontend/.env`)

The frontend uses `VITE_BACKEND_URL` as the Axios base URL. It should include the `/api` prefix.

```bash
VITE_BACKEND_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)

```bash
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=product_dashboard

JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Note: the backend currently sets CORS `origin` explicitly. For local development, you may need to allow `http://localhost:5173` (or your Vite dev URL).

## 🚀 Run Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## ✅ Linting and Tests

### Frontend

```bash
cd frontend
npm run lint
npm test -- --watch=false
```

### Backend

```bash
cd backend
npm run lint
```

## 🔌 API Routes

All routes are mounted under `/api`.

**Auth**

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

**Products** (protected)

- `GET /api/products/get-products`
- `GET /api/products/get-product/:id`
- `POST /api/products/add-product/:userId`
- `PUT /api/products/edit-product/:userId/:id`
- `DELETE /api/products/delete-product/:userId/:id`

## 🔄 CI/CD and Deployment

### GitHub Actions

Workflow file: `.github/workflows/ci.yml`

On push to `main`, the pipeline:

- Installs dependencies
- Runs frontend lint + tests + build
- Runs backend lint
- Triggers backend deploy (Render deploy hook)
- Deploys frontend to Vercel

### Vercel (frontend)

The CI deploy uses the Vercel CLI with these GitHub secrets:

- `VERCEL_TOKEN`

### Render (backend)

Backend deploy is triggered by a Render Deploy Hook configured as:

- `RENDER_DEPLOY_HOOK` (GitHub secret)

## 👤 Author

Kaveesh Yoshitha
Associate Software Engineer Candidate
