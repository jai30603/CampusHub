from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Boolean, DateTime, func, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    college: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    department: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    academic_year: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    role: Mapped[str] = mapped_column(String(50), default="user", nullable=False)
    avatar: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # Notification preferences
    messages_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    reservations_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    reviews_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    account_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    listings: Mapped[List["Listing"]] = relationship("Listing", back_populates="seller", cascade="all, delete-orphan")
    wishlist_items: Mapped[List["Wishlist"]] = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")
