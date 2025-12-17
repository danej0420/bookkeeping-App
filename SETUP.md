# Bookkeeping App Setup Guide

This repository contains two TypeScript projects:

- `backend/`: Express API with Prisma + PostgreSQL.
- `frontend/`: Next.js web client.

## Prerequisites
- Node.js 18+
- PostgreSQL database (local or remote)

## Install dependencies
From the repo root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Backend environment
Copy the sample env file and update it with your values:

```bash
cd backend
cp .env.example .env
```

- `DATABASE_URL` — PostgreSQL connection string.
- `JWT_SECRET` — secret key used to sign auth tokens.

## Run Prisma migrations
With your database reachable and `.env` configured:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

## Running the dev servers
- **Backend**: in `backend/`

  ```bash
  npm run dev
  ```

  The API listens on `http://localhost:4000` by default.

- **Frontend**: in `frontend/`

  ```bash
  npm run dev
  ```

  The web app starts on `http://localhost:3000`. Set `NEXT_PUBLIC_API_URL` in a `frontend/.env.local` file if the API runs on a different URL.

## Available API routes
- `POST /auth/register`
- `POST /auth/login`
- `GET /accounts`
- `POST /accounts`
- `GET /transactions`
- `POST /transactions`
- `GET /summary`

Each non-auth route expects a `Bearer` token created by the auth endpoints.
