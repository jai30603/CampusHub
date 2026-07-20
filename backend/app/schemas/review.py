from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.user import UserResponse
from app.schemas.listing import ListingResponse

class ReviewCreate(BaseModel):
    reservation_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = Field(None, max_length=500)

class ReviewResponse(BaseModel):
    id: int
    reservation_id: int
    listing_id: int
    reviewer_id: int
    reviewee_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    
    reviewer: Optional[UserResponse] = None
    reviewee: Optional[UserResponse] = None
    listing: Optional[ListingResponse] = None

    model_config = ConfigDict(from_attributes=True)
