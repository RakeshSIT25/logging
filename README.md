# Logging Platform

A standalone logging platform with a clean architecture.

## Tech Stack
- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** React, Vite, TailwindCSS, Recharts
- **Infrastructure:** Docker, Docker Compose

## Prerequisites
- Docker & Docker Compose
- OR Node.js v18+ and PostgreSQL

## Quick Start (Docker)

1. Run the application:
   ```bash
   docker-compose up --build
   ```
2. Open [http://localhost:5173](http://localhost:5173)

## Manual Setup

### Database
Ensure PostgreSQL is running and create a database named `logging_platform`.

### Backend
```bash
cd backend
npm install
# Update .env with your DB credentials if needed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints
- `POST /api/logs`: Create a log
- `GET /api/logs`: List logs (pagination, filtering)
- `GET /api/stats`: Get dashboard stats
