import os


# Get base directory path (backend folder)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define all paths relative to backend directory
PATHS = {
    'data': {
        'dataset': "app/data/brfss2023_diabetes_cleaned.csv",
        'x_test_label' : "app/data/X_test_label.csv",
        'y_test_label' : "app/data/y_test_label.csv",
        'x_test_onehot' : "app/data/X_test_onehot.csv",
        'y_test_onehot' : "app/data/y_test_onehot.csv"
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

