from fastapi import APIRouter, Depends, status, File, Form, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from ..utils.deps import get_db, get_current_user
from ..schemas import PostOut
from ..models import User, Post, MediaType
from ..services import post_service
import uuid
import os

router = APIRouter()

@router.get("/", response_model=List[PostOut])
async def get_posts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all posts for the current user.
    """
    return await post_service.get_user_posts(db, user_id=current_user.id)

@router.post("/", response_model=PostOut, status_code=status.HTTP_201_CREATED)
async def create_post(
    caption: Optional[str] = Form(None),
    hashtags: Optional[str] = Form(None),
    media_type: MediaType = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new post with media upload.
    """
    return await post_service.create_post(
        db=db,
        user_id=current_user.id,
        file=file,
        media_type=media_type,
        caption=caption,
        hashtags=hashtags
    )
