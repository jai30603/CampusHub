from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    full_name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    college: Optional[str] = None
    department: Optional[str] = None
    academic_year: Optional[str] = None
    avatar: Optional[str] = None

class ChangePassword(BaseModel):
    current_password: str
    new_password: str

class UserResponse(UserBase):
    id: int
    role: str
    avatar: Optional[str] = None
    is_verified: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse
