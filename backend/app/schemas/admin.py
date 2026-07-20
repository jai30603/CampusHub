from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse
from app.schemas.listing import ListingResponse

class ReportCreate(BaseModel):
    listing_id: Optional[int] = None
    reported_user_id: Optional[int] = None
    reason: str
    description: Optional[str] = None

class ReportResponse(BaseModel):
    id: int
    reporter_id: int
    listing_id: Optional[int] = None
    reported_user_id: Optional[int] = None
    reason: str
    description: Optional[str] = None
    status: str
    
    created_at: datetime
    resolved_at: Optional[datetime] = None
    
    reporter: Optional[UserResponse] = None
    reported_user: Optional[UserResponse] = None
    listing: Optional[ListingResponse] = None

    model_config = ConfigDict(from_attributes=True)

class AdminActivityResponse(BaseModel):
    id: int
    admin_id: int
    action: str
    entity_type: str
    entity_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
