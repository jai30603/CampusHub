# Deploying to Render

1. Push this repository to GitHub.
2. In Render, select **New** then **Blueprint** and connect the repository.
3. Render reads the root `render.yaml`, creates the `campushub` web service and the `campushub-db` PostgreSQL database, and generates the JWT secret.
4. After the deployment completes, open the generated `https://campushub.onrender.com` URL. The frontend and API use the same domain; the API health check is available at `/api/v1/health`.

The container builds the Vite frontend with `VITE_API_URL=/api/v1`, then FastAPI serves it alongside the API. No production CORS configuration or separate frontend deployment is required.

New databases receive the marketplace categories, three sample sellers, and eight sample listings automatically. The seed is idempotent, so redeployments do not duplicate data.

For durable listing image uploads, configure a cloud object-storage provider before launch. The current local upload directory is intentionally excluded from the container image and is not persistent on Render.
