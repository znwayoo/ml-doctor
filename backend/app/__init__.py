from flask import Flask, jsonify, request
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # Define allowed origins
    ALLOWED_ORIGINS = [
        "http://localhost:5173",  # Local development
        "https://ml-doctor-frontend.onrender.com"  # Production
    ]

    # CORS configuration
    CORS(app, 
         resources={
             r"/*": {
                 "origins": ALLOWED_ORIGINS,
                 "methods": ["GET", "POST", "OPTIONS"],
                 "allow_headers": ["Content-Type", "Accept"],
             }
         })

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get('Origin')
        if origin in ALLOWED_ORIGINS:
            if request.method == 'OPTIONS':
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Accept'
            else:
                response.headers['Access-Control-Allow-Origin'] = origin
        return response

    # Add root route for health check
    @app.route('/')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'ML Doctor API is running'
        })

    # Import Blueprints
    from app.routes.api import api_bp
    from app.routes.predict import predict_bp
    from app.routes.charts import charts_bp

    # Register Blueprints
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(predict_bp, url_prefix="/api/predict")
    app.register_blueprint(charts_bp, url_prefix="/api/charts")

    return app
