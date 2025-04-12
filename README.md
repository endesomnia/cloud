## Cloud Storage - JulCloud

### How to start

There are two main ways to run this project:

1.  **Using Docker (Recommended for production-like environment):** Requires Docker installed.
2.  **Using Bun (Recommended for development):** Requires Bun installed.

### Requirements

- Docker (if using Docker)
- Bun (if using Bun)

--- 

### Docker Instructions

#### Start command

##### Basic up (uses pre-built images if available)

```bash
docker compose up -d
```

###### Stop command

```bash
docker compose down
```

##### Start with building images for a specific platform (e.g., macOS or Linux)

```bash
docker compose -f docker-compose.build.yml up -d --build
```

###### Stop command for build

```bash
docker compose -f docker-compose.build.yml down
```

###### Delete all database data

```bash
# Ensure containers are stopped first
docker compose down
# Remove the data volume (check docker-compose.yml for the exact volume name if needed)
sudo rm -rf ./data
```

--- 

### Bun Instructions

#### Backend Setup & Run

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Copy the example environment file:
    ```bash
    cp .env.example .env 
    # Make sure to fill in your actual environment variables in .env
    ```
3.  Install dependencies:
    ```bash
    bun install
    ```
4.  Run database migrations (only needed once initially or after schema changes):
    ```bash
    bunx prisma migrate dev
    ```
5.  Start the backend development server:
    ```bash
    bun run start:dev
    ```

#### Frontend Setup & Run

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Copy the example environment file:
    ```bash
    cp .env.example .env
    # Make sure to fill in your actual environment variables in .env (if any)
    ```
3.  Install dependencies:
    ```bash
    bun install
    ```
4.  Start the frontend development server:
    ```bash
    bun run dev
    ```