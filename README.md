# SyncForge

Starter repo for a lightweight Kanban app built with a PHP backend and React frontend.

## What’s included

- `backend/` — PHP API using `backend/index.php` and file-based task storage.
- `frontend/` — React + Vite UI with Kanban board support.

## Run locally

### Backend
1. Open PowerShell in `backend/`.
2. Run:
   ```powershell
   php -S 127.0.0.1:8000
   ```

### Frontend
1. Open PowerShell in `frontend/`.
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the frontend:
   ```powershell
   npm run dev
   ```

The frontend proxies `/api` requests to the backend.

## Notes

- The backend supports `GET /api/tasks`, `POST /api/tasks`, and `PATCH /api/tasks/:id`.
- The frontend includes a Kanban board with task creation and move actions.
