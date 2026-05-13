from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..utils.deps import get_db, get_current_user
from ..models import Comment, Post, User
from ..schemas import CommentCreate, CommentOut

router = APIRouter()

@router.post("/", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment_in: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if post exists
    post = await db.get(Post, comment_in.post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    new_comment = Comment(
        post_id=comment_in.post_id,
        user_id=current_user.id,
        text=comment_in.text
    )
    db.add(new_comment)
    await db.commit()
    await db.refresh(new_comment)
    return new_comment

@router.get("/{post_id}", response_model=List[CommentOut])
async def get_comments(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Comment).where(Comment.post_id == post_id).order_by(Comment.created_at.asc())
    result = await db.execute(query)
    comments = result.scalars().all()
    return comments

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = await db.get(Comment, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Only the author or post owner can delete (for now just author)
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

    await db.delete(comment)
    await db.commit()
    return None
