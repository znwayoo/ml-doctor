from flask import Blueprint, request, jsonify
from app.utils.chart_dataprocessor import ChartDataProcessor
# from app.services.cache import cache
from config import PATHS

# Define Blueprint
charts_bp = Blueprint('charts', __name__)

# Use paths directly
dataset_path = PATHS['data']['dataset']
encoder_path = PATHS['models']['encoder']
scaler_path = PATHS['models']['scaler']

model_paths = {
    "Logistic Regression": PATHS['models']['logistic'],
    "Decision Tree": PATHS['models']['decision_tree'],
    "XGBoost": PATHS['models']['xgboost'],
    "LightGBM": PATHS['models']['lightgbm']
}

chart_processor = ChartDataProcessor(dataset_path, encoder_path, scaler_path, model_paths)

@charts_bp.route('/distribution', methods=['GET'])
def get_distribution():
    """Returns category-wise data distribution for a given feature"""
    feature = request.args.get('feature')  # Get query parameter
    if not feature:
        return jsonify({"error": "Feature parameter is required"}), 400
    
    result = chart_processor.get_distribution(feature)
    return jsonify(result)

@charts_bp.route('/correlation', methods=['GET'])
def get_correlation_matrix():
    """Returns the correlation matrix of numerical features"""
    result = chart_processor.get_correlation_matrix()
    return jsonify(result)

@charts_bp.route('/avg_risk', methods=['GET'])
def get_avg_risk():
    """Returns the average diabetes risk probability for a given feature"""
    feature = request.args.get('feature')
    if not feature:
        return jsonify({"error": "Feature parameter is required"}), 400

    result = chart_processor.get_avg_risk_by_feature(feature)
    return jsonify(result)

@charts_bp.route('/feature-importance', methods=['GET'])
def get_feature_importance():
    try:
        importance_data = chart_processor.get_feature_importance()
        return jsonify(importance_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500