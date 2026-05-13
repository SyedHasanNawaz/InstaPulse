from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .config import settings
from .routes import api_router
from .database import engine, Base
import asyncio
import os

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for InstaPulse, a social media content optimization platform.",
    version="1.0.0"
)

# Create tables and warm up AI models on startup
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        # This will create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)
    
    # Warm up AI cache (Train model and calculate stats once)
    try:
        import sys
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        if project_root not in sys.path:
            sys.path.append(project_root)
            
        from ml_model.InstaMetrics import get_trained_model, get_dashboard_stats
        import threading
        # Run in a thread so startup isn't blocked too long, but it starts immediately
        threading.Thread(target=get_trained_model, daemon=True).start()
        threading.Thread(target=get_dashboard_stats, daemon=True).start()
        print(f"AI Model & Dashboard cache pre-warming started using {project_root}...")
    except Exception as e:
        print(f"AI Pre-warm failed: {e}")

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the InstaPulse API"}
