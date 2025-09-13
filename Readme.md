\# Cloud Server Management (Track C — Full-Stack)

\> A compact full-stack project to manage cloud servers with a modern, xCloud-style UI: \*\*login\*\*, \*\*CRUD\*\*, \*\*search/filter/sort/pagination\*\*, \*\*bulk delete\*\*, strong validation, and easy deploys on free tiers.

\*\*Why this stack?\*\*

\- \*\*React + Vite + MUI + React Query\*\* — fast DX, sleek UI, query caching + auto refetch.

\- \*\*Node + Express + Mongoose (MongoDB)\*\* — JSON-ish modeling, strong validation, indexing.

\- \*\*JWT\*\* — stateless auth, perfect for Vercel/Render/Railway free tiers.

\- \*\*Docker\*\* — same behavior locally and in production.

\- \*\*Free hosting\*\* — \*\*Vercel\*\* (frontend), \*\*Render\*\* (backend), \*\*MongoDB Atlas\*\* (DB).

\---

\## Table of Contents

1\. \[Architecture\](#architecture)

2\. \[Project Structure\](#project-structure)

3\. \[Features\](#features)

4\. \[Data Model & Validation\](#data-model--validation)

5\. \[Environment Variables\](#environment-variables)

6\. \[Run Locally (Backend + Frontend)\](#run-locally-backend--frontend)

7\. \[Seed Admin User\](#seed-admin-user)

8\. \[API Docs (curl)\](#api-docs-curl)

9\. \[Frontend UX Tour\](#frontend-ux-tour)

10\. \[Debugging Challenges\](#debugging-challenges)

11\. \[Testing (nice-to-have)\](#testing-nice-to-have)

12\. \[Docker & Docker Compose\](#docker--docker-compose)

13\. \[Free Hosting (Vercel + Render + Atlas)\](#free-hosting-vercel--render--atlas)

14\. \[Security Notes\](#security-notes)

15\. \[Troubleshooting & FAQ\](#troubleshooting--faq)

16\. \[AI Collaboration Log\](#ai-collaboration-log)

17\. \[Tech Decisions & Trade-offs\](#tech-decisions--trade-offs)

18\. \[Time Spent (template)\](#time-spent-template)

19\. \[License\](#license)

\---

\## Architecture

User’s Browser (React App)

|

v HTTP requests

/api/... (Axios via React Query)

|

v

Express Backend (Node)

|

v

MongoDB (Mongoose models + indexes)

yaml

Copy code

\- Frontend renders pages/forms and calls the backend at \`/api/...\`.

\- Backend validates and persists data to MongoDB.

\- After login, frontend stores a \*\*JWT\*\* and sends it with each request.

\---

\## Project Structure

\`\`\`text

cloud-server-management/

├── README.md

├── .env.example

├── docker-compose.yml

├── Makefile # optional helper commands

├── Caddyfile # optional for VPS HTTPS (not needed for Vercel/Render)

├── backend/

│ ├── Dockerfile

│ ├── .dockerignore

│ └── src/

│ ├── app.js

│ ├── config/

│ │ └── database.js

│ ├── controllers/

│ │ ├── authController.js

│ │ └── serverController.js

│ ├── middleware/

│ │ └── auth.js

│ ├── models/

│ │ ├── Server.js

│ │ └── User.js

│ ├── routes/

│ │ ├── auth.js

│ │ └── servers.js

│ ├── utils/

│ │ └── validation.js

│ └── seed.js

└── frontend/

├── Dockerfile

├── .dockerignore

├── vercel.json # rewrites /api → backend when deployed on Vercel

├── nginx.conf # used only with Docker/Nginx serving

└── src/

├── main.jsx

├── App.jsx

├── theme.js

├── api.js

├── hooks/

│ ├── useAuth.js

│ └── useServers.js

├── pages/

│ ├── LoginPage.jsx

│ └── ServersPage.jsx

└── components/

├── AppTopBar.jsx

├── FiltersBar.jsx

├── ServerFormDialog.jsx

├── ServerRow.jsx

└── ServerCard.jsx

Features

Auth: JWT login (seeded admin).

Servers: Create, Read, Update, Delete + Bulk Delete.

Productivity: Search, filter, sort, pagination.

UI Modes: List/Grid toggle.

Validation: Joi (API layer) + Mongoose (model layer).

Performance: Query indexes + pagination + .lean().

Security: Helmet headers, rate limiting.

Ops: Dockerized services + free hosting recipe.

Data Model & Validation

Server

name — unique per provider

ip\_address — valid IPv4, globally unique

provider — one of: aws, digitalocean, vultr, other

status — one of: active, inactive, maintenance

cpu\_cores — integer \[1..128\]

ram\_mb — integer \[512..1048576\]

storage\_gb — integer \[10..1048576\]

createdAt, updatedAt — automatic

Indexes

{ name: 1, provider: 1 } — unique

{ ip\_address: 1 } — unique

{ provider: 1, status: 1 }

{ createdAt: -1 }

Environment Variables

Root .env.example (copy to .env):

bash

Copy code

COMPOSE\_PROJECT\_NAME=cloudsrv

FRONTEND\_PORT=3000

BACKEND\_PORT=5000

MONGO\_PORT=27017

JWT\_SECRET=change\_me\_to\_a\_long\_random\_string

NODE\_ENV=production

MONGODB\_URI=mongodb://mongo:27017/cloudservers

FRONTEND\_URL=http://localhost:5173 # Vite dev URL (5173). Use 3000 if Docker frontend

ADMIN\_USERNAME=admin

ADMIN\_EMAIL=admin@example.com

ADMIN\_PASSWORD=admin123

On Render (backend):

MONGODB\_URI = your Atlas connection string

JWT\_SECRET = long random string

NODE\_ENV=production

FRONTEND\_URL=https://.vercel.app (or your custom domain)

Run Locally (Backend + Frontend)

0) Prereqs

Node.js 18+ (or 20+)

npm

MongoDB (local) or MongoDB Atlas

1) Backend (dev)

bash

Copy code

cd backend

cp ../.env.example .env # or create your own .env

npm install

npm run dev # http://localhost:5000

\# health: http://localhost:5000/api/health

If you use Vite dev server, set backend FRONTEND\_URL=http://localhost:5173 and restart backend.

2) Seed admin (first run)

bash

Copy code

\# still in backend/

node src/seed.js

\# login: admin / admin123

3) Frontend (dev)

bash

Copy code

cd ../frontend

npm install

npm run dev # http://localhost:5173

Open http://localhost:5173 and log in with admin / admin123.

Seed Admin User

bash

Copy code

cd backend

\# requires ADMIN\_USERNAME / ADMIN\_EMAIL / ADMIN\_PASSWORD in env

node src/seed.js

If the admin exists, it does nothing.

Otherwise it creates it.

API Docs (curl)

Base URL (dev): http://localhost:5000/api

Base URL (prod): Render URL, e.g. https://.onrender.com/api

bash

Copy code

\# Login

curl -X POST http://localhost:5000/api/auth/login \\

\-H "Content-Type: application/json" \\

\-d '{"usernameOrEmail":"admin","password":"admin123"}'

\# Me (requires token)

curl http://localhost:5000/api/auth/me \\

\-H "Authorization: Bearer "

\# List (search/filter/sort/pagination)

curl "http://localhost:5000/api/servers?page=1&limit=10&search=10.0&provider=aws&status=active&sortBy=createdAt&sortOrder=desc" \\

\-H "Authorization: Bearer "

\# Get one

curl http://localhost:5000/api/servers/ \\

\-H "Authorization: Bearer "

\# Create

curl -X POST http://localhost:5000/api/servers \\

\-H "Authorization: Bearer " \\

\-H "Content-Type: application/json" \\

\-d '{"name":"web-01","ip\_address":"10.0.0.11","provider":"aws","status":"inactive","cpu\_cores":2,"ram\_mb":2048,"storage\_gb":50}'

\# Update

curl -X PUT http://localhost:5000/api/servers/ \\

\-H "Authorization: Bearer " \\

\-H "Content-Type: application/json" \\

\-d '{"status":"active","cpu\_cores":4}'

\# Delete

curl -X DELETE http://localhost:5000/api/servers/ \\

\-H "Authorization: Bearer "

\# Bulk delete

curl -X POST http://localhost:5000/api/servers/bulk-delete \\

\-H "Authorization: Bearer " \\

\-H "Content-Type: application/json" \\

\-d '{"ids":\["",""\]}'

Frontend UX Tour

Login — token stored in localStorage.

Servers page

Filters: search by name/IP, filter by provider/status, sort.

List/Grid toggle, both support selection checkboxes + Bulk Delete.

Add New Server → polished dialog with icons & validation.

Status chips: green=active, red=inactive, amber=maintenance.

Debugging Challenges

Slow Query (5k+ rows) — indexes {name+provider}, {ip\_address}, {provider,status}, {createdAt} + pagination + .lean().

Validation Edge Case (duplicate IP under concurrency) — unique index on ip\_address; catch Mongo code 11000 → clean “Duplicate Entry”.

State Desync (UI wrong after failed update) — React Query cache invalidation; frontend sends only whitelisted fields; backend uses Joi stripUnknown.

Flaky Network (random 500s) — optional Axios retry interceptor (exponential-ish backoff).

Race Condition (two updates collide) — demo keeps last-write-wins; path to optimistic locking via \_\_v documented for prod.

Testing (nice-to-have)

Backend (Jest + Supertest): validate IPv4, duplicate errors, auth guards.

Frontend (React Testing Library): “create server → appears in list”.

Example test script:

bash

Copy code

\# backend/package.json

"test": "jest --runInBand"

Place tests under backend/src/\_\_tests\_\_/.

Docker & Docker Compose

Build & start everything:

bash

Copy code

cp .env.example .env

docker compose up -d --build

Seed admin (one-off):

bash

Copy code

docker compose run --rm --profile seed seed

Open:

UI → http://localhost:3000

API → http://localhost:5000/api/health

Stop:

bash

Copy code

docker compose down

Included Dockerfiles

backend/Dockerfile

dockerfile

Copy code

FROM node:20-alpine AS base

WORKDIR /app

ENV NODE\_ENV=production

COPY package\*.json ./

RUN npm ci --omit=dev || npm install --omit=dev

COPY src ./src

RUN addgroup -S nodegrp && adduser -S nodeuser -G nodegrp

USER nodeuser

EXPOSE 5000

CMD \["node", "src/app.js"\]

frontend/Dockerfile

dockerfile

Copy code

\# build

FROM node:20-alpine AS build

WORKDIR /app

COPY package\*.json ./

RUN npm ci || npm install

COPY . .

RUN npm run build

\# serve

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD \["nginx","-g","daemon off;"\]

frontend/nginx.conf

nginx

Copy code

events {}

http {

include mime.types;

default\_type application/octet-stream;

sendfile on;

server {

listen 3000;

server\_name \_;

root /usr/share/nginx/html;

index index.html;

\# client-side routing

location / {

try\_files $uri $uri/ /index.html;

}

\# Proxy API to backend container

location /api/ {

proxy\_pass http://backend:5000/api/;

proxy\_http\_version 1.1;

proxy\_set\_header Host $host;

proxy\_set\_header X-Forwarded-For $proxy\_add\_x\_forwarded\_for;

proxy\_set\_header Upgrade $http\_upgrade;

proxy\_set\_header Connection "upgrade";

proxy\_read\_timeout 300;

}

}

}

docker-compose.yml

yaml

Copy code

version: "3.9"

services:

mongo:

image: mongo:7

restart: unless-stopped

ports:

\- "${MONGO\_PORT:-27017}:27017"

volumes:

\- mongo\_data:/data/db

healthcheck:

test: \["CMD", "mongosh", "--quiet", "localhost:27017/cloudservers", "--eval", "db.runCommand({ ping: 1 })"\]

interval: 10s

timeout: 3s

retries: 5

backend:

build:

context: ./backend

dockerfile: Dockerfile

restart: unless-stopped

environment:

PORT: ${BACKEND\_PORT:-5000}

MONGODB\_URI: ${MONGODB\_URI}

JWT\_SECRET: ${JWT\_SECRET}

NODE\_ENV: ${NODE\_ENV:-production}

FRONTEND\_URL: ${FRONTEND\_URL}

ADMIN\_USERNAME: ${ADMIN\_USERNAME}

ADMIN\_EMAIL: ${ADMIN\_EMAIL}

ADMIN\_PASSWORD: ${ADMIN\_PASSWORD}

depends\_on:

mongo:

condition: service\_healthy

ports:

\- "${BACKEND\_PORT:-5000}:5000"

healthcheck:

test: \["CMD", "wget", "-qO-", "http://localhost:5000/api/health"\]

interval: 10s

timeout: 3s

retries: 5

frontend:

build:

context: ./frontend

restart: unless-stopped

depends\_on:

backend:

condition: service\_healthy

ports:

\- "${FRONTEND\_PORT:-3000}:3000"

seed:

profiles: \["seed"\]

build:

context: ./backend

environment:

MONGODB\_URI: ${MONGODB\_URI}

ADMIN\_USERNAME: ${ADMIN\_USERNAME}

ADMIN\_EMAIL: ${ADMIN\_EMAIL}

ADMIN\_PASSWORD: ${ADMIN\_PASSWORD}

JWT\_SECRET: ${JWT\_SECRET}

NODE\_ENV: ${NODE\_ENV:-production}

depends\_on:

mongo:

condition: service\_healthy

command: \["node", "src/seed.js"\]

volumes:

mongo\_data:

Free Hosting (Vercel + Render + Atlas)

1) MongoDB Atlas (free)

Create cluster → add DB user → allow your IP → copy connection string.

2) Backend on Render (free)

New Web Service from backend/

Build: npm ci (or npm install)

Start: node src/app.js

Health: /api/health

Env:

text

Copy code

MONGODB\_URI =

JWT\_SECRET =

NODE\_ENV = production

FRONTEND\_URL = https://.vercel.app

Deploy → note URL like https://.onrender.com/api

3) Frontend on Vercel (free)

Root: frontend/

Framework: Vite

Add rewrite in frontend/vercel.json:

json

Copy code

{

"rewrites": \[

{ "source": "/api/(.\*)", "destination": "https://.onrender.com/api/$1" }

\]

}

Deploy → get https://.vercel.app

Update Render FRONTEND\_URL to your Vercel URL and redeploy backend.

Seed admin on Render Shell:

bash

Copy code

node src/seed.js

Security Notes

Use a strong JWT\_SECRET.

Helmet + rate limiter enabled on /api.

Validation both client and server.

Mongo unique indexes enforce IP and (name + provider).

Troubleshooting & FAQ

CORS error

Backend FRONTEND\_URL must match your frontend origin exactly (scheme + domain). Redeploy backend.

First request slow on Render

Free tier sleeps; first request wakes it. Add a small retry on the frontend for 5xx.

400 on PUT

Backend uses stripUnknown; frontend sends only allowed fields. If you modified code, ensure no \_id, \_\_v, createdAt, updatedAt are sent.

Status chips not colored

Ensure your MUI theme doesn’t override MuiChip colors globally; only style default chips.

AI Collaboration Log

Tools: ChatGPT (scaffold/docs), Claude (alt scaffolds), Copilot (micro edits).

Asked & Why: speed up boilerplate, improve UI polish, fix validation, Docker + free hosting recipe.

Accepted vs. Rewrote: accepted base routes/models/UI shells; rewrote Joi stripUnknown, Axios retry, theme chip overrides, proxy config.

Bugs & Fixes: CRA webpack issue → moved to Vite; chip colors overridden → scoped theme; 400 update → whitelist payload + backend strips unknown.

Tech Decisions & Trade-offs

Mongo over SQL for speed; indexes cover query patterns.

JWT over sessions for simplicity on free hosts.

React Query to avoid manual state bugs and handle caching.

Free tiers (Vercel/Render/Atlas) → frictionless deploys; cold starts acceptable for demo.

Left optimistic concurrency as a documented option; demo keeps last-write-wins.

Time Spent (template)

text

Copy code

Planning & reading challenge .......... ~20m

Backend model & routes ................ ~60m

Validation & error handling ........... ~30m

Frontend UI & state ................... ~90m

Docker & Compose ...................... ~30m

Deploy (Vercel/Render/Atlas) .......... ~30m

Docs .................................. ~30m

TOTAL ................................. ~4h 50m