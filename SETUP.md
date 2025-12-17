# Project setup

This repository contains a TypeScript/Node backend and a Next.js frontend.

## Requirements
- Node.js 18+ (ships with npm)
- PostgreSQL database (local or remote)

## Backend
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file based on `.env.example`:
   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/bookkeeping?schema=public"
   JWT_SECRET="super-secret-jwt-key"
   ```
3. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Optionally set the backend URL (defaults to `http://localhost:4000`):
   ```bash
   export NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

The frontend expects the backend to be running on port 4000 and exposes pages for registration, login, a dashboard summary, and transaction management.
