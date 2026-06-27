# HabitFlow AI Architecture

HabitFlow AI is built using a modern, scalable **MERN stack** (MongoDB, Express, React, Node.js) with a strong focus on clean architecture, TypeScript safety, and module boundaries.

## System Overview

```mermaid
graph TD
    Client[React Client (Vite)] --> |REST API| API[Express API Server]
    API --> Controller[Feature Controllers]
    Controller --> Service[Feature Services]
    Service --> Repositories[Mongoose Repositories]
    Repositories --> MongoDB[(MongoDB Atlas)]
    
    Service --> Engines[Business Logic Engines]
    Engines --> Analytics(Analytics Engine)
    Engines --> Insights(Smart Insights Engine)
    Engines --> Gamification(Gamification Engine)
```

## Directory Structure

### Client (`/client`)
- **`/src/api`**: Axios configuration and service modules.
- **`/src/components`**: Reusable UI components and feature-specific components.
- **`/src/hooks`**: Custom React hooks.
- **`/src/pages`**: Route-level components.
- **`/src/store`**: Zustand state management stores.
- **`/src/utils`**: Helper functions (e.g., `cn` for Tailwind).

### Server (`/server`)
- **`/src/config`**: Environment and database setup.
- **`/src/middleware`**: Global middlewares (Auth, Error Handling, Rate Limiting).
- **`/src/modules`**: Feature-based modular architecture. Each module (e.g., `/habit`) contains its own:
  - `routes.ts`: Express routing.
  - `controller.ts`: Request parsing and response formatting.
  - `service.ts`: Business logic orchestrator.
  - `repository.ts`: Database interactions.
  - `validator.ts`: Zod validation schemas.
  - `models/`: Mongoose schemas.

## Data Flow (Request Lifecycle)
1. **Client Request**: Frontend triggers an API call via Axios.
2. **Middleware**: Express helmet, rate limiter, and auth middlewares process the request.
3. **Validator**: Zod validates the `req.body` against DTO schemas.
4. **Controller**: Extracts validated data and passes it to the Service layer.
5. **Service**: Executes business logic and communicates with the Repository.
6. **Repository**: Executes optimized MongoDB queries.
7. **Response**: Service returns data to the Controller, which formats the final JSON response.
