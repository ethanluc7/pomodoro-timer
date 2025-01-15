from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models import db, Users

def create_app():
    app = Flask(__name__)

    # Enable CORS globally for the entire app
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}} )

    # Configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://ethanluc:oRqIqJXpAhLWfsxsSNcW@users-database.c38q0c82swhj.us-east-2.rds.amazonaws.com/users-database'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'y7Gp!2e!RkQTx8&J48X*a6%@Ks34B'

    db.init_app(app)

    migrate = Migrate(app, db)
    jwt = JWTManager(app)

    # Import routes
    from routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api')

    @app.route('/')
    def home():
        return "Welcome to the Flask Application"

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
