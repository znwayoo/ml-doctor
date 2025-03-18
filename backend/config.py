import os
# from dotenv import load_dotenv

# load_dotenv()  # Load environment variables from .env file

# class Config:
    # """Configuration settings for Flask, PostgreSQL, and Redis."""
    # SECRET_KEY = os.getenv("SECRET_KEY")
    
    # # PostgreSQL Database Config
    # SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    # SQLALCHEMY_TRACK_MODIFICATIONS = False

    # # Redis Cache Config
    # CACHE_TYPE = "redis"
    # CACHE_REDIS_URL = os.getenv("REDIS_URL")

# Get base directory path (backend folder)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define all paths relative to backend directory
PATHS = {
    'data': {
        'dataset': "app/data/brfss2023_diabetes_cleaned.csv"
    },
    'models': {
        'logistic': "app/models/lr.joblib",
        'decision_tree': "app/models/dt.joblib",
        'xgboost': "app/models/xgb.json",
        'lightgbm': "app/models/lgb.joblib",
        'encoder': "app/models/onehot.joblib",
        'scaler': "app/models/sscaler.joblib"
    }
}

