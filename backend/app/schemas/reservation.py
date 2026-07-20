from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse
from app.schemas.listing import ListingResponse

class ReservationCreate(BaseModel):
    listing_id: int

class ReservationResponse(BaseModel):
    id: int
    listing_id: int
    buyer_id: int
    seller_id: int
    status: str
    
    requested_at: datetime
    accepted_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    updated_at: datetime
    
    listing: Optional[ListingResponse] = None
    buyer: Optional[UserResponse] = None
    seller: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)
