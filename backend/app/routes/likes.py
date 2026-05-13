from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, func
from ..utils.deps import get_db, get_current_user
from ..models import Like, Post, User
from ..schemas import LikeOut

router = APIRouter()

@router.post("/{post_id}", status_code=status.HTTP_200_OK)
async def toggle_like(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if post exists
    post = await db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Check if user already liked the post
    query = select(Like).where(Like.post_id == post_id, Like.user_id == current_user.id)
    result = await db.execute(query)
    existing_like = result.scalar_one_or_none()

    if existing_like:
        # Unlike
        await db.delete(existing_like)
        await db.commit()
        return {"message": "Post unliked", "liked": False}
    else:
        # Like
        new_like = Like(post_id=post_id, user_id=current_user.id)
        db.add(new_like)
        await db.commit()
        return {"message": "Post liked", "liked": True}

@router.get("/{post_id}", response_model=dict)
async def get_likes(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get total likes
    query_count = select(func.count(Like.id)).where(Like.post_id == post_id)
    result_count = await db.execute(query_count)
    total_likes = result_count.scalar()

    # Check if current user liked it
    query_user = select(Like).where(Like.post_id == post_id, Like.user_id == current_user.id)
    result_user = await db.execute(query_user)
    liked_by_user = result_user.scalar_one_or_none() is not None

    return {
        "post_id": post_id,
        "total_likes": total_likes,
        "liked_by_user": liked_by_user
    }
