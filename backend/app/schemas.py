from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from .models import MediaType

# --- User Schemas ---
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Post Schemas ---
class PostBase(BaseModel):
    media_url: str
    media_type: MediaType
    caption: Optional[str] = None
    hashtags: Optional[str] = None

class PostCreate(PostBase):
    pass

class PostOut(PostBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Comment Schemas ---
class CommentBase(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)

class CommentCreate(CommentBase):
    post_id: int

class CommentOut(CommentBase):
    id: int
    post_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Like Schemas ---
class LikeCreate(BaseModel):
    post_id: int

class LikeOut(BaseModel):
    id: int
    post_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Authentication Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
