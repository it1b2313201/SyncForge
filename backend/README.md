# Backend

This folder contains a lightweight PHP backend for the Kanban app.

## Run backend

1. Open PowerShell in `backend/`.
2. Run:
   ```powershell
   php -S 127.0.0.1:8000
   ```

## API Endpoints

- `GET /api/tasks` - list all tasks
- `POST /api/tasks` - create a task
- `PATCH /api/tasks/:id` - update task status
