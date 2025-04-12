## Description

Backend service for JulCloud storage.

## Project setup with Bun

1.  Navigate to the backend directory (if not already there).
2.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    **Important:** Fill in your actual environment variables in the `.env` file.
3.  Install dependencies:
    ```bash
    bun install
    ```

## Running the project with Bun

```bash
# Development mode (with hot-reloading)
bun run start:dev

# Production mode
bun run start:prod

# Simple start (no watch)
bun run start 
```

## Prisma Database Commands (using Bun)

```bash
# Apply migrations during development (creates DB if not exists, applies migrations)
bun prisma migrate dev 

# Apply migrations in production or CI/CD environment
bun prisma migrate deploy

# Reset database (WARNING: deletes all data and migrations)
bun prisma migrate reset 
```

## Docker Instructions (Alternative)

If you prefer using Docker:

1.  Ensure Docker is installed and running.
2.  Copy the example environment file (if you haven't already):
    ```bash
    cp .env.example .env
    ```
    Make sure the `.env` file is correctly configured, especially database connection details if not using the default Docker setup.
3.  Run the Docker Compose command from the **project root directory**:
    ```bash
    docker compose up -d
    ```
    (Or use `docker-compose.build.yml` if you need to build the image: `docker compose -f ../docker-compose.build.yml up -d --build`)

```bash
bun prisma migrate dev --name main
```

```bash
bun prisma migrate deploy
```