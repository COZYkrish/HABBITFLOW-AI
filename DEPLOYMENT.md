# HabitFlow AI Deployment Guide

HabitFlow AI is designed for seamless deployment on serverless and PaaS platforms. We recommend **Vercel** for the frontend and **Render** for the backend API.

## 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under Network Access, allow access from anywhere (`0.0.0.0/0`) or specific Render IPs.
3. Create a Database User and copy the connection string.

## 2. Backend Deployment (Render)
1. Create a new **Web Service** on Render connected to your repository.
2. Set the Root Directory to `server`.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run start`
5. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGO_URI`: *Your Atlas Connection String*
   - `JWT_SECRET`: *A secure random string*
   - `FRONTEND_URL`: *Your Vercel URL (e.g., https://habitflow.vercel.app)*

## 3. Frontend Deployment (Vercel)
1. Import your repository into Vercel.
2. Set the Root Directory to `client`.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. **Environment Variables**:
   - `VITE_API_BASE_URL`: *Your Render API URL (e.g., https://habitflow-api.onrender.com/api/v1)*

## Post-Deployment Verification
- Ensure the Render URL matches the `VITE_API_BASE_URL` exactly.
- Check the Network tab in DevTools to confirm API requests are successful and CORS headers are correctly applied.
- Ensure static assets (uploaded avatars) are persisted. *Note: Render free tier uses ephemeral storage; for production, migrate avatar uploads to AWS S3 or Cloudinary.*
