from flask import Flask, jsonify
from extensions import db, bcrypt, jwt, cors
from auth_routes import auth_bp
import os

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://user:password@localhost:5432/brown_moving_app')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your_super_secret_jwt_key')

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to Brown Moving App API!"})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)