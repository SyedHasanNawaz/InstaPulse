
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.app.config import settings

print(f"Loaded GROQ_API_KEY: {settings.GROQ_API_KEY[:10]}...")
