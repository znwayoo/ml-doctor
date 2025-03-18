from flask import Blueprint, jsonify

api_bp = Blueprint('api', __name__)

# Root API route
@api_bp.route('/', methods=['GET'])
def api_root():
    return jsonify({
        'status': 'success',
        'message': 'Welcome to ML Doctor API',
        'endpoints': {
            'predict': '/api/predict',
            'charts': '/api/charts'
        }
    })