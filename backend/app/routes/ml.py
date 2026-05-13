from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import sys
import os

# Add ml_model to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
try:
    from ml_model import InstaMetrics
except ImportError:
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
    from ml_model import InstaMetrics

from ..utils.deps import get_db, get_current_user
from ..models import AIAnalysis, User

router = APIRouter()

import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=3)

@router.get("/dashboard")
async def get_dashboard_data(current_user: User = Depends(get_current_user)):
    try:
        loop = asyncio.get_event_loop()
        stats = await loop.run_in_executor(executor, InstaMetrics.get_dashboard_stats)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/optimize")
async def get_optimization_data(
    category: str = "Technology", 
    media_type: str = "reel", 
    followers: int = 5000,
    day: str = "Monday",
    hour: int = 12,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        loop = asyncio.get_event_loop()
        advice = await loop.run_in_executor(executor, lambda: InstaMetrics.get_optimization_advice(category, media_type, followers, day, hour))
        
        # Save to history
        new_analysis = AIAnalysis(
            user_id=current_user.id,
            title=f"{category} Analysis",
            category=category,
            media_type=media_type,
            engagement_rate=advice['potentialBoost'],
            pulse_score=advice['pulseScore'],
            status="Viral" if advice['pulseScore'] > 85 else "Optimal" if advice['pulseScore'] > 70 else "Average",
            reach=advice['reach']
        )
        db.add(new_analysis)
        await db.commit()
        await db.refresh(new_analysis) # Ensure DB write is confirmed
        
        return advice
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_ai_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        result = await db.execute(
            select(AIAnalysis)
            .where(AIAnalysis.user_id == current_user.id)
            .order_by(AIAnalysis.created_at.desc())
        )
        history = result.scalars().all()
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refine-caption")
async def refine_caption(data: dict, current_user: User = Depends(get_current_user)):
    try:
        caption = data.get("caption", "")
        loop = asyncio.get_event_loop()
        refined = await loop.run_in_executor(executor, lambda: InstaMetrics.refine_caption(caption))
        return refined
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
