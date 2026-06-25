# HabitFlow AI

> Build Better Habits. Every Single Day.

HabitFlow AI is a production-grade SaaS application designed to help users track and build better habits through an intuitive interface and AI-driven insights.

## Phase 1 - Project Foundation & Architecture

This repository currently contains the Phase 1 implementation, focusing on the foundational architecture for both the client (React 19) and server (Express). Feature implementations like Auth, CRUD, etc., will be added in future phases.

## Tech Stack

### Frontend
- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router v7**
- **Zustand** (Global state management)
- **TanStack Query** (Data fetching and caching)
- **Framer Motion** & **GSAP** (Animations)
- **React Hook Form** (Form management)
- **Axios** (API client)

### Backend
- **Node.js** & **Express.js**
- **TypeScript**
- **MongoDB Atlas** & **Mongoose**
- **Helmet**, **CORS**, **Morgan**, **Compression**

## Architecture

This project is structured as a monorepo:
- `/client`: Frontend application
- `/server`: Backend API

The backend uses a feature-based modular architecture to easily scale as new features (e.g., Auth, Dashboard, Habit Tracking) are implemented.
The frontend uses categorized component directories and a comprehensive theme token system for a luxury monochrome aesthetic.

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habitflow-ai
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` in both `/client` and `/server` and fill in the values.
   ```bash
   cp .env.example .env
   ```

3. **Install Dependencies**
   *For both client and server, run the following:*
   ```bash
   cd client
   npm install
   
   cd ../server
   npm install
   ```

4. **Run Development Servers**
   *Client:*
   ```bash
   cd client
   npm run dev
   ```
   *Server:*
   ```bash
   cd server
   npm run dev
   ```

## Coding Standards

- Strict TypeScript, avoid `any`.
- Follow SOLID principles.
- Avoid duplicated code.
- Reusable components must be generic.
- Keep business logic separated from UI.
- Use dependency injection where appropriate.

## Future Roadmap
- Phase 2: Cinematic Landing Page
- Phase 3: Authentication & Security
- Phase 4: Core Dashboard UI
- Phase 5: Habit Management (CRUD)
- Phase 6: Analytics & Charts
- Phase 7: AI Insights Engine
- Phase 8: Gamification & Achievements
- Phase 9: Reports & Notifications
- Phase 10: Profile & Settings
- Phase 11: Final Polish
- Phase 12: Production Deployment
