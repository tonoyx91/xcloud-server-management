# Cloud Server Management (Track C — Full-Stack)

> A compact full-stack project to manage cloud servers with a modern, xCloud-style UI: **login**, **CRUD**, **search/filter/sort/pagination**, **bulk delete**, strong validation, and easy deploys on free tiers.

A starter full-stack app using a modern frontend stack (React + Vite + MUI + React Query) and a pragmatic backend (Node + Express + Mongoose). Designed to be easy to run locally (Docker or plain), easy to deploy to free tiers (Vercel + Render + MongoDB Atlas), and simple to extend.

---

Table of Contents
1. [Architecture](#architecture)  
2. [Project Structure](#project-structure)  
3. [Features](#features)  
4. [Data Model & Validation](#data-model--validation)  
5. [Environment Variables](#environment-variables)  
6. [Run Locally (Backend + Frontend)](#run-locally-backend--frontend)  
7. [Seed Admin User](#seed-admin-user)  
8. [API Docs (curl)](#api-docs-curl)  
9. [Frontend UX Tour](#frontend-ux-tour)  
10. [Debugging Challenges](#debugging-challenges)  
11. [Testing (nice-to-have)](#testing-nice-to-have)  
12. [Docker & Docker Compose](#docker--docker-compose)  
13. [Free Hosting (Vercel + Render + Atlas)](#free-hosting-vercel--render--atlas)  
14. [Security Notes](#security-notes)  
15. [Troubleshooting & FAQ](#troubleshooting--faq)  
16. [AI Collaboration Log](#ai-collaboration-log)  
17. [Tech Decisions & Trade-offs](#tech-decisions--trade-offs)  
18. [Time Spent (template)](#time-spent-template)  
19. [License](#license)

---

## Architecture

User’s Browser (React App)
|
v  HTTP requests
/api/... (Axios via React Query)
|
v
Express Backend (Node)
|
v
MongoDB (Mongoose models + indexes)

- Frontend renders pages/forms and calls the backend at `/api/...`.
- Backend validates and persists data to MongoDB.
- After login, frontend stores a **JWT** and sends it with each request.

---

## Project Structure

```text
cloud-server-management/
├── README.md
├── .env.example
├── docker-compose.yml
├── Makefile                 # optional helper commands
├── Caddyfile                # optional for VPS HTTPS (not needed for Vercel/Render)
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── database.js
│       ├── controllers/
│       │   ├── authController.js
│       │   └── serverController.js
│       ├── middleware/
│       │   └── auth.js
│       ├── models/
│       │   ├── Server.js
│       │   └── User.js
│       ├── routes/
│       │   ├── auth.js
│       │   └── servers.js
│       ├── utils/
│       │   └── validation.js
│       └── seed.js
└── frontend/
    ├── Dockerfile
    ├── .dockerignore
    ├── vercel.json          # rewrites /api → backend when deployed on Vercel
    ├── nginx.conf           # used only with Docker/Nginx serving
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── theme.js
        ├── api.js
        ├── hooks/
        │   ├── useAuth.js
        │   └── useServers.js
        ├── pages/
        │   ├── LoginPage.jsx
        │   └── ServersPage.jsx
        └── components/
            ├── AppTopBar.jsx
            ├── FiltersBar.jsx
            ├── ServerFormDialog.jsx
            ├── ServerRow.jsx
            └── ServerCard.jsx
```

---

## Features

- Auth: JWT login (seeded admin).
- Servers: Create, Read, Update, Delete + Bulk Delete.
- Productivity: Search, filter, sort, pagination.
- UI Modes: List/Grid toggle.
- Validation: Joi (API layer) + Mongoose (model layer).
- Performance: Query indexes + pagination + `.lean()`.
- Security: Helmet headers, rate limiting.
- Ops: Dockerized services + free hosting recipe.

---

## Data Model & Validation

Server
- name — unique per provider
- ip_address — valid IPv4, globally unique
- provider — one of: `aws`, `digitalocean`, `vultr`, `other`
- status — one of: `active`, `inactive`, `maintenance`
- cpu_cores — integer `[1..128]`
- ram_mb — integer `[512..1048576]`
- storage_gb — integer `[10..1048576]`
- createdAt, updatedAt — automatic

Indexes
- `{ name: 1, provider: 1 }` — unique
- `{ ip_address: 1 }` — unique
- `{ provider: 1, status: 1 }`
- `{ createdAt: -1 }`

Validation
- Joi schema used for request validation (stripUnknown enabled).
- Mongoose schema includes limits and unique constraints.
- Duplicate key errors are mapped to human-friendly messages.

---

## Environment Variables

Root `.env.example` (copy to `.env`):

```bash
COMPOSE_PROJECT_NAME=cloudsrv
FRONTEND_PORT=3000
BACKEND_PORT=5000
MONGO_PORT=27017

JWT_SECRET=change_me_to_a_long_random_string
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/cloudservers
FRONTEND_URL=http://localhost:5173   # Vite dev URL (5173). Use 3000 if Docker frontend

ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

Notes:
- On Render (backend): set MONGODB_URI to your Atlas connection string, set JWT_SECRET to a long random string, and FRONTEND_URL to your Vercel URL.
- Keep secrets out of your repo.

---

## Run Locally (Backend + Frontend)

0) Prereqs
- Node.js 18+ (or 20+)
- npm
- MongoDB (local) or MongoDB Atlas

1) Backend (dev)
```bash
cd backend
cp ../.env.example .env      # or create your own .env
npm install
npm run dev                  # http://localhost:5000
# health: http://localhost:5000/api/health
```

If you use Vite dev server, set backend `FRONTEND_URL=http://localhost:5173` and restart backend.

2) Seed admin (first run)
```bash
# still in backend/
node src/seed.js
# login: admin / admin123
```

3) Frontend (dev)
```bash
cd ../frontend
npm install
npm run dev                  # http://localhost:5173
```

Open http://localhost:5173 and log in with admin / admin123.

---

## Seed Admin User

```bash
cd backend
# requires ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD in env
node src/seed.js
```

- If the admin exists, the script does nothing.
- Otherwise it creates the admin user.

---

## API Docs (curl)

Base URL (dev): `http://localhost:5000/api`  
Base URL (prod): Render URL, e.g. `https://<service>.onrender.com/api`

Examples:
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"admin123"}'

# Me (requires token)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"

# List (search/filter/sort/pagination)
curl "http://localhost:5000/api/servers?page=1&limit=10&search=10.0&provider=aws&status=active&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer <TOKEN>"

# Get one
curl http://localhost:5000/api/servers/<id> \
  -H "Authorization: Bearer <TOKEN>"

# Create
curl -X POST http://localhost:5000/api/servers \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"web-01","ip_address":"10.0.0.11","provider":"aws","status":"inactive","cpu_cores":2,"ram_mb":2048,"storage_gb":50}'

# Update
curl -X PUT http://localhost:5000/api/servers/<id> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"active","cpu_cores":4}'

# Delete
curl -X DELETE http://localhost:5000/api/servers/<id> \
  -H "Authorization: Bearer <TOKEN>"

# Bulk delete
curl -X POST http://localhost:5000/api/servers/bulk-delete \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"ids":["<id1>","<id2>"]}'
```

---

## Frontend UX Tour

- Login — token stored in localStorage.
- Servers page:
  - Filters: search by name/IP, filter by provider/status, sort.
  - List/Grid toggle, both support selection checkboxes + Bulk Delete.
  - Add New Server → polished dialog with icons & validation.
  - Status chips: green=active, red=inactive, amber=maintenance.

---

## Debugging Challenges

- Slow Query (5k+ rows) — add indexes `{name+provider}`, `{ip_address}`, `{provider,status}`, `{createdAt}`, use pagination and `.lean()`.
- Validation Edge Case (duplicate IP under concurrency) — unique index on `ip_address`; catch Mongo code `11000` → show “Duplicate Entry”.
- State Desync (UI wrong after failed update) — React Query cache invalidation; backend uses Joi stripUnknown; frontend sends only whitelisted fields.
- Flaky Network (random 500s) — consider Axios retry interceptor with exponential backoff.
- Race Condition (two updates collide) — demo keeps last-write-wins; document path to optimistic locking via `__v` for production.

---

## Testing (nice-to-have)

- Backend (Jest + Supertest): validate IPv4, duplicate errors, auth guards.
- Frontend (React Testing Library): “create server → appears in list”.

Example:
```bash
# backend/package.json
"test": "jest --runInBand"
```
Put tests under `backend/src/__tests__/`.

---

## Docker & Docker Compose

Build & start everything:
```bash
cp .env.example .env
docker compose up -d --build
```

Seed admin (one-off):
```bash
docker compose run --rm --profile seed seed
```

Open:
- UI → http://localhost:3000
- API → http://localhost:5000/api/health

Stop:
```bash
docker compose down
```

Included Dockerfiles and configs are provided in `backend/` and `frontend/`.

---

## Free Hosting (Vercel + Render + Atlas)

1) MongoDB Atlas (free)
- Create cluster → add DB user → allow your IP → copy connection string.

2) Backend on Render (free)
- New Web Service from `backend/`
- Build: `npm ci`
- Start: `node src/app.js`
- Health: `/api/health`
- Env:
  ```
  MONGODB_URI = <Atlas URI>
  JWT_SECRET  = <long random>
  NODE_ENV    = production
  FRONTEND_URL = https://<your-vercel-app>.vercel.app
  ```
- Deploy → note URL like `https://<service>.onrender.com/api`

3) Frontend on Vercel (free)
- Root: `frontend/`
- Framework: Vite
- Add rewrite in `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://<your-render-service>.onrender.com/api/$1" }
  ]
}
```
- Deploy → get `https://<your-vercel>.vercel.app`
- Update Render `FRONTEND_URL` to your Vercel URL and redeploy backend.
- Seed admin on Render Shell:
```bash
node src/seed.js
```

---

## Security Notes

- Use a strong `JWT_SECRET`.
- Helmet + rate limiter enabled on `/api`.
- Validation both client and server.
- Mongo unique indexes enforce IP and `(name + provider)`.
- Keep environment variables and secrets out of git. Use platform secrets for production.

---

## Troubleshooting & FAQ

CORS error
- Backend `FRONTEND_URL` must match your frontend origin exactly (scheme + domain). Redeploy backend.

First request slow on Render
- Free tier sleeps; first request wakes it. Add a small retry on frontend for 5xx if you want.

400 on PUT
- Backend uses `stripUnknown`; frontend sends only allowed fields. Ensure you don't send `_id`, `__v`, `createdAt`, `updatedAt`.

Status chips not colored
- Ensure your MUI theme doesn’t override `MuiChip` colors globally; only style default chips.

---

## AI Collaboration Log

- Tools: ChatGPT (scaffold/docs), Claude (alt scaffolds), Copilot (micro edits).
- Asked & Why: speed up boilerplate, improve UI polish, fix validation, Docker + free hosting recipe.
- Accepted vs. Rewrote: accepted base routes/models/UI shells; rewrote Joi `stripUnknown`, Axios retry, theme chip overrides, proxy config.
- Bugs & Fixes: CRA → migrated to Vite; chip colors overridden → scoped theme; 400 update → whitelist payload + backend strips unknown.

---

## Tech Decisions & Trade-offs

- Mongo over SQL for speed; indexes cover query patterns.
- JWT over sessions for simplicity on free hosts.
- React Query to avoid manual state bugs and handle caching.
- Free tiers (Vercel/Render/Atlas) → frictionless deploys; cold starts acceptable for demo.
- Left optimistic concurrency as a documented option; demo keeps last-write-wins.

---

## Time Spent (template)

```text
Planning & reading challenge .......... ~20m
Backend model & routes ................ ~60m
Validation & error handling ........... ~30m
Frontend UI & state ................... ~90m
Docker & Compose ...................... ~30m
Deploy (Vercel/Render/Atlas) .......... ~30m
Docs .................................. ~30m
TOTAL ................................. ~4h 50m
```

---
