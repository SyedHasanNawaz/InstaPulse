import os
import uuid
from typing import List, Optional
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..models.post import Post, MediaType
from ..schemas import PostCreate
from ..models.user import User

UPLOAD_DIR = "uploads"

async def create_post(
    db: AsyncSession, 
    user: User, 
    file: UploadFile, 
    caption: Optional[str] = None, 
    hashtags: Optional[str] = None
) -> Post:
    # 1. Determine media type
    content_type = file.content_type
    if content_type.startswith("image/"):
        media_type = MediaType.IMAGE
    elif content_type.startswith("video/"):
        media_type = MediaType.VIDEO
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only images and videos are supported"
        )

    # 2. Save file to disk
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {e}"
        )

    # 3. Create database record
    # media_url will be the relative path for now
    media_url = f"/uploads/{unique_filename}"
    
    db_post = Post(
        user_id=user.id,
        media_url=media_url,
        media_type=media_type,
        caption=caption,
        hashtags=hashtags
    )
    
    db.add(db_post)
    await db.commit()
    await db.refresh(db_post)
    return db_post

async def get_posts(
    db: AsyncSession, 
    skip: int = 0, 
    limit: int = 10, 
    media_type: Optional[MediaType] = None
) -> List[Post]:
    query = select(Post)
    if media_type:
        query = query.filter(Post.media_type == media_type)
    
    query = query.offset(skip).limit(limit).order_by(Post.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

async def get_post_by_id(db: AsyncSession, post_id: int) -> Optional[Post]:
    result = await db.execute(select(Post).filter(Post.id == post_id))
    return result.scalar_one_or_none()
