from fastapi import APIRouter
from .auth import router as auth_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
# Future routers will be included here
# api_router.include_router(posts_router, prefix="/posts", tags=["posts"])
