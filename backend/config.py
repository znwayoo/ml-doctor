import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

class Config:
    """Configuration settings for Flask, PostgreSQL, and Redis."""
    SECRET_KEY = os.getenv("SECRET_KEY")
    
    # PostgreSQL Database Config
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Redis Cache Config
    CACHE_TYPE = "redis"
    CACHE_REDIS_URL = os.getenv("REDIS_URL")

