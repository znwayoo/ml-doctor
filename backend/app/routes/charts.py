from flask import Blueprint, request, jsonify
from app.utils.chart_dataprocessor import ChartDataProcessor
from app.services.cache import cache

# Define Blueprint
charts_bp = Blueprint('charts', __name__)

# Initialize data processor with dataset path
dataset_path = "app/data/brfss2023_diabetes_cleaned.csv"
encoder_path = "app/models/onehot.joblib"
scaler_path = "app/models/sscaler.joblib"

chart_processor = ChartDataProcessor(dataset_path, encoder_path, scaler_path)

@charts_bp.route('/distribution', methods=['GET'])
@cache.memoize(timeout=86400)
def get_distribution():
    """Returns category-wise data distribution for a given feature"""
    feature = request.args.get('feature')  # Get query parameter
    if not feature:
        return jsonify({"error": "Feature parameter is required"}), 400
    
    result = chart_processor.get_distribution(feature)
    return jsonify(result)

@charts_bp.route('/correlation', methods=['GET'])
@cache.memoize(timeout=86400)
def get_correlation_matrix():
    """Returns the correlation matrix of numerical features"""
    result = chart_processor.get_correlation_matrix()
    return jsonify(result)

@charts_bp.route('/avg_risk', methods=['GET'])
@cache.memoize(timeout=86400)
def get_avg_risk():
    """Returns the average diabetes risk probability for a given feature"""
    feature = request.args.get('feature')
    if not feature:
        return jsonify({"error": "Feature parameter is required"}), 400

    result = chart_processor.get_avg_risk_by_feature(feature)
    return jsonify(result)
