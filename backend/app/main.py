import os
from pathlib import Path
from sqlalchemy import inspect, text
from fastapi import FastAPI, Request, status
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from app.config.settings import settings
from app.database.session import engine, SessionLocal
from app.database.base import Base
from app.database.seed import seed_sample_marketplace
from app.api.v1 import auth, users, categories, listings, wishlist, conversations, reservations, reviews, admin, analytics

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

def ensure_sqlite_schema_compatibility():
    """Add columns introduced after an existing local SQLite DB was created."""
    if not settings.DATABASE_URL.startswith("sqlite"):
        return

    inspector = inspect(engine)
    if "users" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}
    user_columns = {
        "messages_enabled": "BOOLEAN NOT NULL DEFAULT 1",
        "reservations_enabled": "BOOLEAN NOT NULL DEFAULT 1",
        "reviews_enabled": "BOOLEAN NOT NULL DEFAULT 1",
        "account_enabled": "BOOLEAN NOT NULL DEFAULT 1",
    }

    with engine.begin() as connection:
        for column_name, column_sql in user_columns.items():
            if column_name not in existing_columns:
                connection.execute(text(f"ALTER TABLE users ADD COLUMN {column_name} {column_sql}"))

ensure_sqlite_schema_compatibility()

# Seed default categories and a small sample catalog for new installations.
db = SessionLocal()
try:
    seed_sample_marketplace(db)
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    description="Backend REST API for CampusHub - College Student Marketplace",
    version="1.0.0",
)

# ── Middleware Stack ──────────────────────────────────────────────────────────

# GZip compression for all responses > 1KB
app.add_middleware(GZipMiddleware, minimum_size=1024)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security response headers (applied to every response)
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

# ── Static Media ──────────────────────────────────────────────────────────────

uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# ── Exception Handlers ────────────────────────────────────────────────────────

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handles expected HTTP errors (4xx) with a structured JSON response."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail if isinstance(exc.detail, str) else "Request error.",
            "errors": [{"message": str(exc.detail)}],
        },
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catches any unhandled server-side exception. Never leaks internals in production."""
    is_dev = settings.APP_ENV == "development"
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": str(exc) if is_dev else "An internal server error occurred. Please try again later.",
            "errors": [{"message": str(exc) if is_dev else "Internal server error"}],
        },
    )

# ── Health Checks ─────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root_health_check():
    """Root health check — used by Render to confirm service is alive."""
    return {
        "success": True,
        "name": settings.PROJECT_NAME,
        "status": "healthy",
        "docs_url": f"{settings.API_V1_STR}/docs",
    }

@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
def api_health_check():
    """Detailed health endpoint for uptime monitoring (Render health check path)."""
    return {
        "success": True,
        "status": "healthy",
        "environment": settings.APP_ENV,
        "version": "1.0.0",
    }

# ── Register V1 API Routers ───────────────────────────────────────────────────

app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(categories.router, prefix=settings.API_V1_STR)
app.include_router(listings.router, prefix=settings.API_V1_STR)
app.include_router(wishlist.router, prefix=settings.API_V1_STR)
app.include_router(conversations.router, prefix=settings.API_V1_STR)
app.include_router(reservations.router, prefix=settings.API_V1_STR)
app.include_router(reviews.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)

# The production Docker image includes the compiled React app. Keep this after
# API routes so /api/v1 requests are always handled by their own routers.
frontend_dist_dir = os.getenv("FRONTEND_DIST_DIR")
if frontend_dist_dir and Path(frontend_dist_dir).is_dir():
    frontend_root = Path(frontend_dist_dir).resolve()

    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_frontend(full_path: str):
        requested_file = (frontend_root / full_path).resolve()
        if requested_file.is_relative_to(frontend_root) and requested_file.is_file():
            return FileResponse(requested_file)
        return FileResponse(frontend_root / "index.html")
