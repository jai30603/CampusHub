from datetime import datetime
from typing import Optional, List, Any
from sqlalchemy import String, Text, Numeric, Integer, ForeignKey, DateTime, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base

class Listing(Base):
    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="active", nullable=False)  # active, reserved, sold, archived
    condition: Mapped[str] = mapped_column(String(50), nullable=False)  # Brand New, Like New, Good, Fair

    category_id: Mapped[int] = mapped_column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    seller_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Dynamic JSONB attributes for flexible category specifics (ISBN, specs, brand, semester)
    attributes: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True, default={})

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    category: Mapped["Category"] = relationship("Category", back_populates="listings")
    seller: Mapped["User"] = relationship("User", back_populates="listings")
    images: Mapped[List["ListingImage"]] = relationship("ListingImage", back_populates="listing", cascade="all, delete-orphan")
    wishlist_entries: Mapped[List["Wishlist"]] = relationship("Wishlist", back_populates="listing", cascade="all, delete-orphan")

class ListingImage(Base):
    __tablename__ = "listing_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    listing_id: Mapped[int] = mapped_column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    listing: Mapped["Listing"] = relationship("Listing", back_populates="images")
