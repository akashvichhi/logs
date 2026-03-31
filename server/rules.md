# FastAPI Development Rules & Guidelines

## 1. Project Structure
Follow a feature-based modular structure:

```text
app/
  auth/
  api_keys/
  logs/
  core/
```

Each module must contain its own domain logic:
* `models.py`: Database ORM models
* `schemas.py`: Pydantic validation schemas
* `router.py`: API routes and endpoints (Controllers)
* `service.py`: Business logic
* `dependencies.py`: Reusable dependencies
* **Rule:** Never put business logic inside `router.py`. Always delegate to `service.py`.

## 2. Router (Controller) Rules
Routers must remain thin and act only as traffic controllers.
* Only handle HTTP request/response parsing.
* Call the service layer for execution.
* **Rule:** Do not put business logic inside the controller/router. Always use a service. No database queries or complex `if/else` rules should exist here.

## 3. Service Layer Rules
Services are the "brain" of the application.
* All module-specific business logic must live here.
* Handle database operations through CRUD calls.
* Contain complex validations beyond basic schema types.
* Raise `HTTPException` when business rules fail.

## 4. Shared & Common Logic Rules
If logic is used in more than one module, it must be extracted to a shared location. Do not copy-paste code.
* **Shared Domain Logic (`app/services/`):** If multiple domains need the same complex action (e.g., `email_service.py`, `notification_service.py`), create a global service that any module can import.
* **Request-Scoped Logic (`app/dependencies.py`):** If the logic intercepts an HTTP request before it hits the endpoint (e.g., extracting a user from a JWT, role checks, yielding a database session), write it as a FastAPI Dependency.
* **Generic Utilities (`app/utils/`):** If the logic is a stateless, generic helper function that doesn't touch the database (e.g., password hashing, math calculations, string formatting), place it here.

## 5. Schema Validation Rules
Use Pydantic for all input validation and output formatting.
* Use `@model_validator` for complex, multi-field validation.
* **Rule:** Never trust raw request data. Always validate via schemas before processing.

## 6. Exception Handling Rules
Utilize global exception handlers to keep routers clean.
* Always raise: `raise HTTPException(status_code=400, detail="Error message")`
* Do NOT return error dictionaries manually.
* Keep the error format consistent (e.g., `{"messages": ["Error message"]}`).

## 7. Database Rules
Centralize database configuration in `app/core/database.py`.
* Use dependency injection (`Depends`) for providing database sessions to endpoints.
* **Rule:** Never create database sessions manually inside services or routers.

## 8. Security Rules
Keep all security and cryptography logic centralized in `app/core/security.py`.
* The Auth module should handle JWT/token generation and validation.
* **Rule:** Never duplicate authentication or hashing logic across different modules.

## 9. API Design Rules
Use consistent routing prefixes and RESTful conventions.
* Group endpoints by domain: `/auth`, `/api-keys`, `/logs`.
* Follow standard HTTP methods: `GET /items`, `POST /items`, `GET /items/{id}`, `DELETE /items/{id}`.

## 10. Middleware & Config Rules
Global configurations must live in `app/core/config.py`.
* Avoid hardcoding values (like `"*"` for CORS in production).
* **Rule:** Rely entirely on environment-based configuration using `.env` files.

## 11. Logging Rules
Logging is a separate infrastructure concern.
* Capture structured logs globally or via dependencies.
* **Rule:** Do not clutter business logic with basic `print()` statements.

## 12. Migration Rules (Alembic)
Treat database migrations as an immutable ledger.
* Every schema change must result in a new migration file.
* **Rule:** Never edit old, already-applied migration files.

## 13. Naming Conventions
* **Files & Modules:** `snake_case` (e.g., `auth_service.py`)
* **Classes:** `PascalCase` (e.g., `UserService`)
* **Variables & Functions:** `snake_case` (e.g., `user_id`)

## 14. Clean Code Standards
* Remove all `print()` statements before committing code; replace them with proper logging.
* Utilize strict typing (`-> dict`, `-> str`) for all function signatures.

## 15. Core Philosophy
* **Routers / Controllers:** Input/Output routing only.
* **Services:** Core Business Logic.
* **Models:** Database Shape.
* **Schemas:** Data Validation.
* **Core / Utils:** Shared System Infrastructure.
