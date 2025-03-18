from flask import Blueprint, jsonify

api_bp = Blueprint('api', __name__)

# Import submodules to register their routes
from app.routes.predict import predict_bp

# Register the `predict` blueprint under the API namespace
api_bp.register_blueprint(predict_bp, url_prefix='/')

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200