from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from backend.routes.auth_routes import auth_bp
from flask_cors import CORS
from dotenv import load_dotenv
import os
from backend.models import db, Users

load_dotenv()


def create_app():
    app = Flask(__name__)

    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

    CORS(
        app,
        resources={r"/*": {"origins": FRONTEND_ORIGIN}},
        supports_credentials=True,
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["JWT_IDENTITY_CLAIM"] = "sub"

    db.init_app(app)

    migrate = Migrate(app, db)
    jwt = JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix="/api")

    @app.route("/")
    def home():
        return "Welcome to the Flask Application"

    return app



app = create_app()
