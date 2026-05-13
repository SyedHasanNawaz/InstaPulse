import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "InstaMetrics"
    DATABASE_URL: str = "sqlite+aiosqlite:///./instametrics.db"
    GROQ_API_KEY: str = ""
    SECRET_KEY: str = os.getenv("SECRET_KEY", "fallback_secret_key_change_in_production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    OLLAMA_MODEL: str = "llama3.2:3b"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"

settings = Settings()
