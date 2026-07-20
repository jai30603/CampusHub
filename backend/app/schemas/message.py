from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse
from app.schemas.listing import ListingResponse

class MessageCreate(BaseModel):
    message: str

class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    message: str
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ConversationStart(BaseModel):
    listing_id: int

class ConversationResponse(BaseModel):
    id: int
    listing_id: int
    buyer_id: int
    seller_id: int
    last_message_at: datetime
    created_at: datetime
    
    listing: Optional[ListingResponse] = None
    buyer: Optional[UserResponse] = None
    seller: Optional[UserResponse] = None
    
    # Custom fields for frontend display
    other_user: Optional[UserResponse] = None
    last_message: Optional[str] = None
    unread_count: int = 0

    model_config = ConfigDict(from_attributes=True)
