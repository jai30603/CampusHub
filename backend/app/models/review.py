from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Integer, ForeignKey, DateTime, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base

class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    reservation_id: Mapped[int] = mapped_column(Integer, ForeignKey("reservations.id", ondelete="CASCADE"), nullable=False)
    listing_id: Mapped[int] = mapped_column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    reviewer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reviewee_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    rating: Mapped[int] = mapped_column(Integer, nullable=False) # 1 to 5 stars
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True) # Max 500 chars optional comment
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    reservation: Mapped["Reservation"] = relationship("Reservation")
    listing: Mapped["Listing"] = relationship("Listing")
    reviewer: Mapped["User"] = relationship("User", foreign_keys=[reviewer_id])
    reviewee: Mapped["User"] = relationship("User", foreign_keys=[reviewee_id])

    __table_args__ = (
        UniqueConstraint("reservation_id", "reviewer_id", name="uq_reservation_reviewer"),
    )
