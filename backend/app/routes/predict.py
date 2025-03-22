from flask import Blueprint, request, jsonify
from app.utils.model_predictor import ModelPredictor
# from app.services.database import Prediction
# from app.services.cache import cache
from config import PATHS

# Define Blueprint for predictions
predict_bp = Blueprint('predict', __name__)

# Define model paths using config
model_paths = {
    "Logistic_Regression": PATHS['models']['logistic'],
    "Decision_Tree": PATHS['models']['decision_tree'],
    "XGBoost": PATHS['models']['xgboost'],
    "LightGBM": PATHS['models']['lightgbm']
}
encoder_path = PATHS['models']['encoder']
scaler_path = PATHS['models']['scaler']

# Initialize predictor class
predictor = ModelPredictor(model_paths, encoder_path, scaler_path)

# @predict_bp.route('/predict', methods=['POST'])
# @cache.memoize(timeout=3600)  # Cache for 1 hour
# def predict():
#     """API endpoint to get diabetes risk predictions."""
#     try:
#         user_input = request.json  # Get JSON request body

#         # Check if result is already cached
#         # cache_key = f"predict_{hash(str(user_input))}"
#         # cached_result = cache.get(cache_key)
#         # if cached_result:
#         #     return jsonify({"predictions": cached_result, "cached": True})

#         # If not cached, compute predictions
#         predictions = predictor.predict(user_input)

#         # Save to DB
#         new_prediction = Prediction(user_input=user_input, model_predictions=predictions)
#         new_prediction.save()

#         # # Store result in cache
#         # cache.set(cache_key, predictions, timeout=3600)

#         return jsonify({"predictions": predictions, "cached": False})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@predict_bp.route('', methods=['POST', 'OPTIONS'])
def predict():
    """API endpoint to get diabetes risk predictions."""
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        user_input = request.json
        predictions = predictor.predict(user_input)
        return jsonify({"predictions": predictions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
