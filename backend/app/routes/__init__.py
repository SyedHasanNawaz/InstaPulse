from fastapi import APIRouter
from .auth import router as auth_router
from .ml import router as ml_router
from .posts import router as posts_router
from .likes import router as likes_router
from .comments import router as comments_router
from .chatbot import router as chatbot_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(ml_router, prefix="/ml", tags=["ml"])
api_router.include_router(posts_router, prefix="/posts", tags=["posts"])
api_router.include_router(likes_router, prefix="/likes", tags=["likes"])
api_router.include_router(comments_router, prefix="/comments", tags=["comments"])
api_router.include_router(chatbot_router, prefix="/chatbot", tags=["chatbot"])

