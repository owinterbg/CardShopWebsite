import os
from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def uploaded_file(filename):
    uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'uploads'))
    print(f"🟢 Serving image from: {uploads_dir}")
    return send_from_directory(uploads_dir, filename)

def create_app():
    app = Flask(__name__)
    
    CORS(app) 

    # Determine absolute path to the database file
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(basedir, '..', 'app.db')

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret'  # 🔐 Replace with env var in prod
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"


    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Import models (ensures migrations pick them up)
    from app.models import user

    # Register blueprints
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp)
    from app.routes.centering_routes import centering_bp
    app.register_blueprint(centering_bp)
    
    app.add_url_rule('/api/uploads/<filename>', view_func=uploaded_file)

    return app
