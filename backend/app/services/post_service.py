import os
import uuid
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models import Post, MediaType
from datetime import datetime, timezone

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../uploads")

async def get_user_posts(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Post)
        .where(Post.user_id == user_id)
        .order_by(Post.created_at.desc())
    )
    return result.scalars().all()

async def create_post(
    db: AsyncSession, 
    user_id: int, 
    file: UploadFile, 
    media_type: MediaType,
    caption: str = None, 
    hashtags: str = None
):
    # Validate file type
    allowed_image_types = ["image/jpeg", "image/png", "image/gif"]
    allowed_video_types = ["video/mp4", "video/quicktime"]
    
    if media_type == MediaType.IMAGE and file.content_type not in allowed_image_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image type. Only JPEG, PNG and GIF are allowed."
        )
    elif media_type == MediaType.VIDEO and file.content_type not in allowed_video_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid video type. Only MP4 and QuickTime are allowed."
        )

    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # Save file to disk
    try:
        with open(file_path, "wb") as f:
            # Efficiently write the file in chunks
            while content := await file.read(1024 * 1024): # 1MB chunks
                f.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )
    
    # Create DB record
    media_url = f"/uploads/{filename}"
    
    db_post = Post(
        user_id=user_id,
        media_url=media_url,
        media_type=media_type,
        caption=caption,
        hashtags=hashtags
    )
    
    db.add(db_post)
    await db.commit()
    await db.refresh(db_post)
    
    return db_post
