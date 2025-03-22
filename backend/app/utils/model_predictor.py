import joblib
import pandas as pd
from xgboost import XGBClassifier

class ModelPredictor:
    def __init__(self, model_paths, encoder_path, scaler_path):
        """Initialize and load models, encoder, and scaler."""

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
        self.models_requiring_encoding = ["Logistic_Regression", "KNN"]

        # Define feature types
        self.features_to_encode = ['age_group', 'race', 'education', 'bmi_category', 'alcohol_consumption_cat']
        self.binary_features = ['sex', 'physical_activity', 'smoking_status', 
                                'high_blood_pressure', 'high_cholesterol', 'heart_disease', 'kidney_disease']

    def preprocess_input(self, user_input):
        """Encodes and scales input for models that need it."""
        user_input_df = pd.DataFrame([user_input])

        # One-hot encoding for categorical features
        encoded_features = self.encoder.transform(user_input_df[self.features_to_encode])
        encoded_features_df = pd.DataFrame(encoded_features, columns=self.encoder.get_feature_names_out())

        # Merge encoded categorical features with binary features
        user_input_onehot = pd.concat([encoded_features_df, user_input_df[self.binary_features]], axis=1)

        # Apply scaling
        user_input_onehot_scaled = self.scaler.transform(user_input_onehot)

        return user_input_df, user_input_onehot_scaled

    def predict(self, user_input):
        """Makes predictions with the appropriate input format for each model."""
        user_input_df, user_input_onehot_scaled = self.preprocess_input(user_input)
        
        results = {}
        for model_name, model in self.models.items():
            if model_name in self.models_requiring_encoding:
                pred = float(model.predict_proba(user_input_onehot_scaled)[0][1])  # Encoded input
            else:
                pred = float(model.predict_proba(user_input_df)[0][1])
            
            results[model_name] = pred
        
        return results
