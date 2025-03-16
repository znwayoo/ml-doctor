import pandas as pd
import joblib

class ChartDataProcessor:
    def __init__(self, dataset_path, encoder_path, scaler_path):
        """Initialize by loading dataset, encoder, and scaler"""
        self.df = pd.read_csv(dataset_path, index_col='id')
        self.encoder = joblib.load(encoder_path)
        self.scaler = joblib.load(scaler_path)

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
        
        grouped_data = self.df.groupby(feature)["diabetes_status"].mean()
        return grouped_data.to_dict()
