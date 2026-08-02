# Project LOOP

Project LOOP is a feedback analytics dashboard built with Next.js, TypeScript, Prisma, and an Express ingestion API.

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Prisma
- Express
- Tailwind CSS

## Features

- Feedback dashboard UI with KPI cards and charts
- Feedback feed and detail drawer
- AI insights modal components
- API routes for analytics, insights, and ingest flows
- Express backend endpoint for ingest and health checks

## Project Structure

- `src/app` - Next.js app router pages and API routes
- `src/components` - UI components
- `src/lib` - shared types and library code
- `prisma` - database schema
- `server.js` - Express backend server

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Generate Prisma client

```bash
npm run prisma:generate
```

### 3. Start frontend (development)

```bash
npm run dev -- -p 3003
```

Open: `http://localhost:3003`

### 4. Start Express backend (optional, separate terminal)

```bash
npm run server
```

Backend default: `http://localhost:4000`

### 5. Production build and start

```bash
npm run build
npm run start -- -p 3003
```

## Scripts

- `npm run dev` - start Next.js dev server
- `npm run server` - start Express server
- `npm run build` - Prisma generate + Next.js production build
- `npm run start` - start Next.js production server
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:push` - push Prisma schema to DB

## Notes

- Local environment variables should stay in `.env` and are ignored by git.
- `node_modules` and build artifacts are excluded from version control.
