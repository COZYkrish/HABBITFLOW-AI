# HabitFlow AI

![HabitFlow AI](/client/public/og-image.jpg)

HabitFlow AI is an intelligent, premium habit tracker that helps you build a better life through smart analytics, personalized insights, and engaging gamification. Built with the modern MERN stack.

## ✨ Features
- **Premium Dashboard**: Glassmorphism UI, responsive design, and smooth animations.
- **Smart Analytics**: Heatmaps, timeline charts, and completion trends.
- **AI Insight Engine**: Personalized recommendations (e.g., Burnout warnings, Consistency boosts).
- **Gamification**: Earn XP, level up, and unlock achievements as you build habits.
- **Advanced Reports**: Export your data to CSV or PDF.
- **Secure Authentication**: JWT with HTTP-only cookies, robust session management.

## 🛠️ Technology Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand, Recharts.
- **Backend**: Node.js, Express, TypeScript, Mongoose, Zod, express-rate-limit.
- **Database**: MongoDB Atlas.

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/habitflow-ai.git
cd habitflow-ai
```

### 2. Environment Setup
Copy the environment example files:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```
*Make sure to fill in your MongoDB connection string in `server/.env`.*

### 3. Install Dependencies
```bash
# Terminal 1: Backend
cd server
npm install

# Terminal 2: Frontend
cd client
npm install
```

### 4. Run the Application
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

Visit `http://localhost:5173` to see the application running.

## 📚 Documentation
- [Architecture Overview](./ARCHITECTURE.md)
- [API Documentation](./API_DOCS.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 📄 License
This project is licensed under the MIT License.
