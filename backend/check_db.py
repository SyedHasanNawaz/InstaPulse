import asyncio
import sys
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Add the current directory to sys.path to ensure 'app' can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.config import settings
    from app.database import Base
except ImportError as e:
    print(f"Import Error: {e}")
    print("Make sure you are running this script from the 'backend' directory.")
    sys.exit(1)

async def check_conn():
    print(f"Connecting to: {settings.DATABASE_URL}")
    engine = create_async_engine(settings.DATABASE_URL)
    try:
        async with engine.connect() as conn:
            print("Connection successful!")
            
            # Check for tables
            result = await conn.execute(text("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'"))
            tables = result.fetchall()
            if tables:
                print(f"Found tables: {', '.join([t[0] for t in tables])}")
            else:
                print("No user tables found in the database.")
                
    except Exception as e:
        print(f"Connection failed: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_conn())
