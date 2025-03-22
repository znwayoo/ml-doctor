import pandas as pd
import joblib
import numpy as np
from xgboost import XGBClassifier

class ChartDataProcessor:
    def __init__(self, dataset_path, encoder_path, scaler_path, model_paths):
        """Initialize by loading dataset, encoder, scaler and models"""
        self.df = pd.read_csv(dataset_path, index_col='id')
        self.models = {}
        for name, path in model_paths.items():
            if name == "XGBoost":
                # Special handling for XGBoost
                xgb_model = XGBClassifier()
                xgb_model.load_model(path)  # Load JSON file
                self.models[name] = xgb_model
            else:
                # Standard joblib loading for other models
                self.models[name] = joblib.load(path)
        # self.models = {name: joblib.load(path) for name, path in model_paths.items()}
        self.encoder = joblib.load(encoder_path)
        self.scaler = joblib.load(scaler_path)
        
        # Models that need one-hot encoding & scaling
        self.models_requiring_encoding = ["Logistic Regression", "KNN"]

        # Define feature types
        self.features_to_encode = ['age_group', 'race', 'education', 'bmi_category', 'alcohol_consumption_cat']
        self.binary_features = ['sex', 'physical_activity', 'smoking_status', 
                                'high_blood_pressure', 'high_cholesterol', 'heart_disease', 'kidney_disease']

    def get_distribution(self, column):
        """Returns category-wise count percentages for a given column"""
        if column not in self.df.columns:
            return {"error": f"Column '{column}' not found in dataset"}

        data = self.df[column].value_counts(normalize=True) * 100
        return data.to_dict()  # Convert series to dictionary

    def get_correlation_matrix(self):
        """Returns correlation matrix for numerical features"""
        return self.df.corr().to_dict()

    def get_avg_risk_by_feature(self, feature):
        """Returns average diabetes risk probability for each feature category"""
        if feature not in self.df.columns:
            return {"error": f"Feature '{feature}' not found in dataset"}
        
        grouped_data = self.df.groupby(feature)["diabetes_status"].mean() * 100
        return grouped_data.to_dict()

    def get_feature_importance(self):
        """Returns feature importance for tree-based models"""
        feature_importance = {}
        
        # Define features once, outside the loop
        features = self.df.columns[:-1]  # Exclude target variable
        
        for model_name, model in self.models.items():
            # Skip models that don't have feature_importances_
            if model_name not in ["Decision Tree", "Random Forest", "XGBoost", "LightGBM"]:
                continue
                
            try:
                importance = model.feature_importances_
                
                # Create sorted importance dictionary
                importance_dict = dict(zip(features, importance))
                sorted_importance = dict(sorted(
                    importance_dict.items(), 
                    key=lambda x: x[1], 
                    reverse=True
                ))
                
                feature_importance[model_name] = {
                    'features': list(sorted_importance.keys()),
                    'importance': [float(x) for x in sorted_importance.values()]  # Convert to native Python float
                }
            except AttributeError:
                continue
        
        return feature_importance
