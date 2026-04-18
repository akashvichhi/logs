# Backend: FastAPI & PostgreSQL

This is the backend API for the project, built with Python (FastAPI) and backed by a PostgreSQL database.

## Prerequisites

* Docker and Docker Compose installed on your machine.

## Getting Started

1. **Start the server and database:**
   From the root of the project, run:
   ```bash
   docker compose up server -d
   ```

2. **Access the API:**
   * **Base URL:** `http://localhost:8000`
   * **Interactive API Docs (Swagger UI):** `http://localhost:8000/docs`
   * **Alternative API Docs (ReDoc):** `http://localhost:8000/redoc`

## Environment Variables

Ensure these are set in your root `.env` file:
* `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: Database credentials.
* `POSTGRES_HOST`: `postgres`
* `POSTGRES_PORT`: `5432`
* `SECRET_KEY`, `JWT_ALGORITHM`, `JWT_EXPIRE_HOURS`: Auth settings.
* `FIRST_ADMIN_*`: Initial admin credentials.

## Development

The container runs Uvicorn with `--reload`. Changes to Python files in `./server` automatically restart the server.

## Database Migrations (Alembic)

Run migrations inside the running container:

* **Apply migrations:**
    ```bash
    docker compose exec server alembic upgrade head
    ```
* **Generate new migration:**
    ```bash
    docker compose exec server alembic revision --autogenerate -m "Description"
    ```
Here are the commands to rollback migrations using Alembic inside your Docker container:

**Rollback the most recent migration (go back 1 step):**
```bash
docker compose exec server alembic downgrade -1
```

**Rollback to a specific migration revision:**
```bash
docker compose exec server alembic downgrade <revision_id>
```

**Rollback all migrations (reset the database entirely):**
```bash
docker compose exec server alembic downgrade base
```

## PostgreSQL Database Backup & Restore Guide

This project includes a fully automated Dockerized backup system for the PostgreSQL database using the `prodrigestivill/postgres-backup-local` image. 

Backups are automatically saved to the `./db_backups` folder on the host machine.

---

## 🕒 Automated Schedule (Cron)

The automated backup is configured to run daily at **11:00 PM IST**. 

This is controlled by the following environment variables in the `docker-compose.yml` file under the `db_backup` service:
- `SCHEDULE: '0 23 * * *'` (Runs at 23:00 / 11:00 PM)
- `TZ: Asia/Kolkata` (Forces the container to use India Standard Time instead of UTC)
- `BACKUP_KEEP_DAYS: 30` (Automatically deletes backups older than 30 days to save disk space)

---

## 💾 How to Run a Manual Backup

If you need to trigger a backup immediately without waiting for the scheduled 11:00 PM run, you can execute the backup script manually inside the running container.

**For Linux, Mac, or Windows PowerShell:**
```bash
docker exec db_backup /backup.sh
```

## ♻️ Restore a Backup
```bash
docker exec -i postgres psql -U <YOUR_POSTGRES_USER> -d <YOUR_POSTGRES_DB> < backup.sql
```
