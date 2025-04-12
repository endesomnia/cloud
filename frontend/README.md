# Up

1) 
```bash
mv .env.example .env
```

2)
```bash
docker compose up -d
```

## Frontend Setup and Run with Bun

1.  Navigate to the frontend directory (if not already there).
2.  Copy the example environment file (if needed for specific frontend variables):
    ```bash
    cp .env.example .env 
    ```
    **Note:** Fill in any necessary frontend-specific variables in `.env`.
3.  Install dependencies:
    ```bash
    bun install
    ```
4.  Start the development server:
    ```bash
    bun run dev
    ```

## Docker Instructions (Alternative)

If you prefer using Docker:

1.  Ensure Docker is installed and running.
2.  Copy the example environment file (if needed and you haven't already):
    ```bash
    cp .env.example .env
    ```
3.  Run the Docker Compose command from the **project root directory**:
    ```bash
    docker compose up -d
    ```
    (Or use `docker-compose.build.yml` if you need to build the image: `docker compose -f ../docker-compose.build.yml up -d --build`)