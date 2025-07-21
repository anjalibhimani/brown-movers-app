from flask import Blueprint, request, jsonify
from models import db, User
from extensions import bcrypt
from flask_jwt_extended import create_access_token
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    graduation_year = data.get('graduationYear')
    is_service_provider = data.get('isServiceProvider', False)
    services_offered = data.get('servicesOffered', [])
    hourly_rate = data.get('hourlyRate', 0.0)
    thirty_min_rate = data.get('thirtyMinRate', 0.0)

    if not all([email, password, first_name, last_name, graduation_year]):
        return jsonify({"msg": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User with that email already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        email=email,
        password_hash=hashed_password,
        first_name=first_name,
        last_name=last_name,
        graduation_year=graduation_year,
        is_service_provider=is_service_provider,
        services_offered=services_offered if is_service_provider else [],
        hourly_rate=hourly_rate if is_service_provider else 0.0,
        thirty_min_rate=thirty_min_rate if is_service_provider else 0.0
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