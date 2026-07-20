from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse
from app.schemas.category import CategoryResponse

class ListingImageBase(BaseModel):
    image_url: str
    sort_order: int = 0

class ListingImageResponse(ListingImageBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ListingBase(BaseModel):
    title: str
    description: str
    price: float
    condition: str
    category_id: int
    attributes: Optional[Dict[str, Any]] = {}

class ListingCreate(ListingBase):
    images: List[str] = []

class ListingResponse(ListingBase):
    id: int
    status: str
    seller_id: int
    seller: Optional[UserResponse] = None
    category: Optional[CategoryResponse] = None
    images: List[ListingImageResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
