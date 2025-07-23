# creates the main Flask server, configures the required database, registers all my API routes for the project
    
from flask import Flask, jsonify
from extensions import db, bcrypt, jwt, cors
from auth_routes import auth_bp
import os
from dotenv import load_dotenv

load_dotenv()

"""
    function that creates and configures the Flask app

    @return {Flask} - the final Flask application instance 
"""

def create_app():
    app = Flask(__name__)

    # load the secret key and database URI from env vars for security
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://anbhimani:Radhu-176-$jlm#@localhost:5432/brown_moving_app')

    # turn off tracking
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # configure key to sign and authenticate JSON Web Tokens 
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your_super_secret_jwt_key')

    # initialize the databse, encryption, and JSON Web Token extensions for the Flask app 
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # enable frontend server to make requests 
    cors = CORS(resources={r"/api/*": {"origins": "*"}})
    cors.init_app(app)

    # modularize app for organization purposes, all authorization routes prefixed to /api/auth
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    # confirm upon running to check if API is up and functioning
    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to Brown Moving App API!"})

    # create all uncreated tables from defined models 
    with app.app_context():
        db.create_all()
        
    return app

# create the app, and run on debug mode to help with dev
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
