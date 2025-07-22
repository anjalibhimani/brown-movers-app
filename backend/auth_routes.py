from flask import Blueprint, request, jsonify
from models import db, User
from extensions import bcrypt
from flask_jwt_extended import create_access_token
from datetime import timedelta
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    if request.content_type and request.content_type.startswith('multipart/form-data'):
        data = request.form
        file = request.files.get('profilePicture')
    else:
        data = request.get_json()
        file = None
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    graduation_year = data.get('graduationYear')
    is_service_provider = data.get('isServiceProvider', False)
    services_offered = data.get('servicesOffered', [])
    hourly_rate = data.get('hourlyRate', 0.0)
    thirty_min_rate = data.get('thirtyMinRate', 0.0)

    if isinstance(is_service_provider, str):
        is_service_provider = is_service_provider.lower() == 'true'
    if isinstance(services_offered, str):
        services_offered = [services_offered]
    if isinstance(hourly_rate, str):
        hourly_rate = float(hourly_rate)
    if isinstance(thirty_min_rate, str):
        thirty_min_rate = float(thirty_min_rate)
    if isinstance(graduation_year, str):
        graduation_year = int(graduation_year)

    if not all([email, password, first_name, last_name, graduation_year]):
        return jsonify({"msg": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User with that email already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    profile_picture_filename = None
    if file:
        filename = secure_filename(file.filename)
        profile_picture_filename = filename
        file.save(os.path.join(UPLOAD_FOLDER, filename))

    new_user = User(
        email=email,
        password_hash=hashed_password,
        first_name=first_name,
        last_name=last_name,
        graduation_year=graduation_year,
        is_service_provider=is_service_provider,
        services_offered=services_offered if is_service_provider else [],
        hourly_rate=hourly_rate if is_service_provider else 0.0,
        thirty_min_rate=thirty_min_rate if is_service_provider else 0.0,
        profile_picture=profile_picture_filename
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully", "user_id": new_user.id}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"msg": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))
        return jsonify(access_token=access_token, user=user.to_dict()), 200
    else:
        return jsonify({"msg": "Bad email or password"}), 401

@auth_bp.route('/movers', methods=['GET'])
def get_movers():
    movers = User.query.filter_by(is_service_provider=True).all()
    result = [
        {
            'id': m.id,
            'profile_picture': m.profile_picture,
            'first_name': m.first_name,
            'last_name': m.last_name,
            'graduation_year': m.graduation_year
        }
        for m in movers
    ]
    return jsonify(result), 200

@auth_bp.route('/movers/<int:user_id>', methods=['GET'])
def get_mover_detail(user_id):
    mover = User.query.filter_by(id=user_id, is_service_provider=True).first()
    if not mover:
        return jsonify({'msg': 'Mover not found'}), 404
    return jsonify(mover.to_dict()), 200
