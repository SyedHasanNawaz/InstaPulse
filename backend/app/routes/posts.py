from typing import List, Optional
from fastapi import APIRouter, Depends, status, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..utils.deps import get_db, get_current_user
from ..schemas import PostOut
from ..services import post_service
from ..models import User, MediaType

router = APIRouter()

@router.post("/", response_model=PostOut, status_code=status.HTTP_201_CREATED)
async def create_post(
    caption: Optional[str] = Form(None),
    hashtags: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a new post or reel.
    The type is automatically determined by the file content type.
    """
    return await post_service.create_post(
        db=db, 
        user=current_user, 
        file=file, 
        caption=caption, 
        hashtags=hashtags
    )

@router.get("/", response_model=List[PostOut])
async def read_posts(
    skip: int = 0,
    limit: int = 10,
    type: Optional[MediaType] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve posts. Can be filtered by type (IMAGE or VIDEO).
    """
    return await post_service.get_posts(db=db, skip=skip, limit=limit, media_type=type)

@router.get("/reels", response_model=List[PostOut])
async def read_reels(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Shortcut to retrieve only reels (videos).
    """
    return await post_service.get_posts(db=db, skip=skip, limit=limit, media_type=MediaType.VIDEO)

@router.get("/{post_id}", response_model=PostOut)
async def read_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific post by ID.
    """
    post = await post_service.get_post_by_id(db, post_id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post
