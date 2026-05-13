
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.app.database import Base, engine
from backend.app.models import User
from backend.app.utils.security import get_password_hash

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Check if test user exists
        result = await session.execute(text("SELECT * FROM users WHERE email='test@example.com'"))
        user = result.fetchone()
        if not user:
            print("Creating test user...")
            new_user = User(
                username="testuser",
                email="test@example.com",
                hashed_password=get_password_hash("Password123"),
                is_active=True
            )
            session.add(new_user)
            await session.commit()
            print("Test user created!")
        else:
            print("Test user already exists.")

if __name__ == "__main__":
    asyncio.run(seed())
