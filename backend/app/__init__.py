from flask import Flask
from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate

from config import Config

# from app.services.cache import init_cache

# # Initialize extensions
# db = SQLAlchemy()
# migrate = Migrate()

def create_app():
    """Factory function to create Flask app."""
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    # # Initialize database & migration
    # db.init_app(app)
    # migrate.init_app(app, db)
    # init_cache(app)

    # # Add cache clearance command
    # @app.cli.command('clear-cache')
    # def clear_cache_():
    #     """Clear all cached results"""
    #     with app.app_context():
    #         from app.services.cache import cache
    #         cache.clear()
    #         print("✅ Cache cleared successfully")

    # Import Blueprints
    from app.routes.api import api_bp
    from app.routes.predict import predict_bp
    from app.routes.charts import charts_bp

    # Register Blueprints
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(predict_bp, url_prefix="/api/predict")
    app.register_blueprint(charts_bp, url_prefix="/api/charts")

    return app
