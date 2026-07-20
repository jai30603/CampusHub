from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base

class AdminActivity(Base):
    __tablename__ = "admin_activity"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    admin_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    action: Mapped[str] = mapped_column(Text, nullable=False) # e.g. "Admin suspended user Rahul"
    entity_type: Mapped[str] = mapped_column(String(100), nullable=False) # user, listing, category, report
    entity_id: Mapped[int] = mapped_column(Integer, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    admin: Mapped["User"] = relationship("User")
