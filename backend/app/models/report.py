from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base

class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    reporter_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    listing_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("listings.id", ondelete="SET NULL"), nullable=True)
    reported_user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    
    reason: Mapped[str] = mapped_column(String(100), nullable=False) # spam, duplicate, fake listing, inappropriate content, fraud, other
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False) # pending, resolved, dismissed
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    reporter: Mapped["User"] = relationship("User", foreign_keys=[reporter_id])
    listing: Mapped["Listing"] = relationship("Listing")
    reported_user: Mapped["User"] = relationship("User", foreign_keys=[reported_user_id])
