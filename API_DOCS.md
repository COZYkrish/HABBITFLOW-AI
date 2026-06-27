# HabitFlow AI API Documentation

The HabitFlow AI API is a RESTful service built with Express and Node.js. All endpoints (except public ones) require a valid JWT token passed in an HTTP-only cookie.

## Authentication Endpoints

### `POST /api/v1/auth/register`
Creates a new user account.
- **Body:** `{ "name": "...", "email": "...", "password": "..." }`
- **Response:** `{ "success": true, "data": { "user": {...} } }`

### `POST /api/v1/auth/login`
Authenticates a user and sets an HTTP-only JWT cookie.
- **Body:** `{ "email": "...", "password": "..." }`
- **Response:** `{ "success": true, "data": { "user": {...}, "accessToken": "..." } }`

### `POST /api/v1/auth/logout`
Clears the JWT cookie and revokes the active session.
- **Response:** `{ "success": true }`

---

## Habit Endpoints

### `GET /api/v1/habits`
Retrieves all habits for the authenticated user.
- **Response:** `{ "success": true, "data": [{...}] }`

### `POST /api/v1/habits`
Creates a new habit.
- **Body:** `{ "title": "...", "description": "...", "frequency": {...}, "timeOfDay": "...", "color": "..." }`
- **Response:** `{ "success": true, "data": {...} }`

### `PATCH /api/v1/habits/:id`
Updates an existing habit.
- **Body:** Partial habit object.

### `POST /api/v1/habits/:id/logs`
Logs progress for a habit on a specific date.
- **Body:** `{ "date": "YYYY-MM-DD", "status": "completed|skipped|failed", "notes": "..." }`
- **Response:** `{ "success": true, "data": {...} }`

---

## Insights & Gamification

### `GET /api/v1/insights`
Generates and returns personalized AI insights based on the user's habit data.
- **Response:** `{ "success": true, "data": [{ "id": "...", "type": "productivity", "title": "...", "description": "...", "actionable": true }] }`

### `GET /api/v1/gamification`
Retrieves the user's level, XP, and unlocked achievements.
- **Response:** `{ "success": true, "data": { "level": 5, "currentXP": 1500, "nextLevelXP": 2000, "achievements": [...] } }`

---

## Global Error Responses

All API errors return a standard JSON structure:
```json
{
  "success": false,
  "error": {
    "message": "Error description here",
    "details": ["validation error 1", "validation error 2"]
  }
}
```
