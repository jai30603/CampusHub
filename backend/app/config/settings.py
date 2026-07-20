import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CampusHub API"
    API_V1_STR: str = "/api/v1"
    APP_ENV: str = os.getenv("APP_ENV", "development")

    # Database: Uses SQLite locally by default if PostgreSQL is not provided
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./campushub.db"
    )

    # Security & JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey_replace_in_production_environment_32chars")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")

    # CORS — read from env as comma-separated list, fall back to safe defaults
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    @property
    def ALLOWED_ORIGINS(self) -> list[str]:
        raw = os.getenv(
            "ALLOWED_ORIGINS",
            "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://campushub.vercel.app",
        )
        return [origin.strip() for origin in raw.split(",") if origin.strip()]

    class Config:
        case_sensitive = True

settings = Settings()
