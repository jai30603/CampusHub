from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.listing import ListingResponse

class WishlistCreate(BaseModel):
    listing_id: int

class WishlistResponse(BaseModel):
    id: int
    user_id: int
    listing_id: int
    listing: Optional[ListingResponse] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
