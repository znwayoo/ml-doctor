import os


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

