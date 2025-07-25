# defines all the API endpoints for steps like registering, logging in, updating your profile, getting to see all the movers, etc

from flask import Blueprint, request, jsonify, send_from_directory
from models import db, User
from extensions import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os
from werkzeug.utils import secure_filename
from datetime import datetime
from .models import Availability # Make sure to import the new model

# define folder to store the mover's uploaded photo file for their profile (fallback make the directory if cannot find)
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# create a Flask bluebrint to modularize 
auth_bp = Blueprint('auth', __name__)

"""
    this route deals with new user registration by processing the form submission data and optional picture, and creates the user in database 

    @return {Response} - a JSON object with a success message and user_id, or if an issue occurs then an error message
"""

@auth_bp.route('/register', methods=['POST'])
def register():
    # check to see if the request has file-type data from the profile pic, if not then request body is normal JSON 
    if request.content_type and request.content_type.startswith('multipart/form-data'):
        data = request.form
        file = request.files.get('profilePicture')
    else:
        data = request.get_json()
        file = None

    # extract the user's profile data from data dict, if missing set the default value for the optional fields
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    graduation_year = data.get('graduationYear')
    is_service_provider = data.get('isServiceProvider', False)
    services_offered = data.get('servicesOffered', [])
    hourly_rate = data.get('hourlyRate', 0.0)
    thirty_min_rate = data.get('thirtyMinRate', 0.0)
    phone_number = data.get('phoneNumber')

    # convert strings from the form to boolean vars 
    if isinstance(is_service_provider, str):
        is_service_provider = is_service_provider.lower() == 'true'
    
    # set the services offered by the user as a list
    if isinstance(services_offered, str):
        services_offered = [services_offered]

    # convert form numbers to ints and floats
    if isinstance(hourly_rate, str):
        hourly_rate = float(hourly_rate)
    if isinstance(thirty_min_rate, str):
        thirty_min_rate = float(thirty_min_rate)
    if isinstance(graduation_year, str):
        graduation_year = int(graduation_year)

    # confirm all mandatory fields from form were submitted 
    if not all([email, password, first_name, last_name, graduation_year]):
        return jsonify({"msg": "Missing required fields"}), 400

    # cannot have multiple users with the same email register 
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User with that email already exists"}), 409

    # hash user password for data security 
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # clean file name and add to the folder if a pic was uploaded
    profile_picture_filename = None
    if file:
        filename = secure_filename(file.filename)
        profile_picture_filename = filename
        file.save(os.path.join(UPLOAD_FOLDER, filename))

    # create new User instance for this user with their data 
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
        profile_picture=profile_picture_filename,
        phone_number=phone_number
    )

    # add and commit this user instance to the database 
    db.session.add(new_user)
    db.session.commit()

    # success message for dev stage
    return jsonify({"msg": "User registered successfully", "user_id": new_user.id}), 201

"""
    this route deals with authentication for when a user wants to login

    @return {Response} - a JSON object with an access token and the user's account data, or if issue occurs then error message
"""

@auth_bp.route('/login', methods=['POST'])
def login():
    # extract email and password fields from user's submission
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # if one of either fields is missing, error cannot login 
    if not all([email, password]):
        return jsonify({"msg": "Missing email or password"}), 400

    # search for the user un the database based on their email
    user = User.query.filter_by(email=email).first()

    # verify user was found, and that the password matches the account, if not then error message
    if user and bcrypt.check_password_hash(user.password_hash, password):
        # create a JSON Web Token access token with user's ID, and return the user's data 
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))
        return jsonify(access_token=access_token, user=user.to_dict()), 200
    else:
        return jsonify({"msg": "Bad email or password"}), 401

"""
    this route deals with fetching the profile data for the user who has logged in, 
    only processes request if valid authorization header with token with the secret key 

    @return {Response} - a JSON object with the user's data, or the user not found error 
"""

@auth_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    # extract user id from token, and search for user in the databse... if not found error, if found then return object as dictionary
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'User not found'}), 404
    return jsonify(user.to_dict()), 200


"""
    this route deals with updating the profile for the logged in user, 
    needs valid authorization header with token with the secret key  

    @return {Response} - a JSON object with a message indicating successful completion and the updated user data, 
                        or an error is an issue occurs.
"""

@auth_bp.route('/user/update', methods=['PUT'])
@jwt_required()
def update_user():
    # extract user id from token, search for user in databse... if not found error
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'User not found'}), 404

    # based on if pic was uploaded or not handle the requests seperately
    if request.content_type and request.content_type.startswith('multipart/form-data'):
        data = request.form
        file = request.files.get('profilePicture')
    else:
        data = request.get_json()
        file = None

    # update the fields with the new data if user updated it, if not then keep original
    user.email = data.get('email', user.email)
    user.first_name = data.get('firstName', user.first_name)
    user.last_name = data.get('lastName', user.last_name)
    user.graduation_year = data.get('graduationYear', user.graduation_year)
    user.phone_number = data.get('phoneNumber', user.phone_number)

    # if isServiceProvider info collected and user is a mover now, then convert to boolean, else just use original value
    is_service_provider = data.get('isServiceProvider', user.is_service_provider)
    if isinstance(is_service_provider, str):
        user.is_service_provider = is_service_provider.lower() == 'true'
    else:
        user.is_service_provider = is_service_provider

    # if the user is a mover, then try to update mover data where changes were made in the form 
    if user.is_service_provider:
        services_offered = data.get('servicesOffered', user.services_offered)
        if isinstance(services_offered, str):
            user.services_offered = [services_offered]
        else:
            user.services_offered = services_offered
        user.hourly_rate = float(data.get('hourlyRate', user.hourly_rate))
        user.thirty_min_rate = float(data.get('thirtyMinRate', user.thirty_min_rate))
    
    # if user is not a mover anymore then reset those fields
    else:
        user.services_offered = []
        user.hourly_rate = 0.0
        user.thirty_min_rate = 0.0

    # update the user's photo if uploaded new one and exists
    if file:
        filename = secure_filename(file.filename)
        user.profile_picture = filename
        file.save(os.path.join(UPLOAD_FOLDER, filename))

    # push all changes to the database and return a successful message indicator 
    db.session.commit()
    return jsonify({"msg": "User updated successfully", "user": user.to_dict()}), 200
   
"""
    this route deals with feteching all the users who are movers 

    @return {Response} - a JSON array of mover(user) summary objects for their cards
"""

@auth_bp.route('/movers', methods=['GET'])
def get_movers():
    # search for all users who are listed as moving or packing helpers
    movers = User.query.filter_by(is_service_provider=True).all()
    # summarize basic info to later make the mover cards
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

"""
    this route deals with fetching the detailed data for a specific mover/packer 

    @param {int} user_id - the id of the mover the user is trying to view details for
    @return {Response} - a JSON object with the mover's full profile data, or if an issue occures then an error 
"""

@auth_bp.route('/movers/<int:user_id>', methods=['GET'])
def get_mover_detail(user_id):
    # search all users with the id being looked for who are movers
    mover = User.query.filter_by(id=user_id, is_service_provider=True).first()
    
    # if mover not found then error, else return their data dict, and fetch their availability slots to add to their final data 
    if not mover:
        return jsonify({'msg': 'Mover not found'}), 404

    mover_data = mover.to_dict()
    availabilities = Availability.query.filter_by(user_id=user_id).order_by(Availability.start_time).all()
    mover_data['availabilities'] = [a.to_dict() for a in availabilities]
    return jsonify(mover_data), 200 

"""
    this route deals with adding a new availability slot for the logged-in mover right now

    @return {Response} - a JSON object with the message with success or error with the corresponding status code   
"""

@auth_bp.route('/user/availability', methods=['POST'])
@jwt_required()
def add_availability():
    # extract the user ID from JSON Web Token, and retrieve user data from databse
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # if it happens that a non mover accessed this because of issues, then prevent inform them they must be a mover
    if not user or not user.is_service_provider:
        return jsonify({"msg": "Only service providers can add availability"}), 403

    # retrieve slot start and end times
    data = request.get_json()
    start_time_str = data.get('start_time')
    end_time_str = data.get('end_time')

    if not start_time_str or not end_time_str:
        return jsonify({"msg": "Missing start_time or end_time"}), 400

    # conversion to a  datetime object
    start_time = datetime.fromisoformat(start_time_str.replace('Z', '+00:00')) 
    end_time = datetime.fromisoformat(end_time_str.replace('Z', '+00:00'))

    # create the new slot the mover added, and add this to the database
    new_slot = Availability(user_id=user_id, start_time=start_time, end_time=end_time)
    db.session.add(new_slot)
    db.session.commit()

    # return the slot and message to confirm it is good 
    return jsonify({"msg": "Availability added successfully", "availability": new_slot.to_dict()}), 201

"""
    this route deals with fetching all available slots for a specific mover

    @param {int} user_id - the ID of the mover person
    @return {Response} - a JSON array of availability slots if no error, else a JSON object with an error message
"""

@auth_bp.route('/movers/<int:user_id>/availability', methods=['GET'])
def get_availability(user_id):
    # find the mover based on the id provided
    user = User.query.get(user_id)

    # if the mover is not found error, else return their slots  
    if not user or not user.is_service_provider:
        return jsonify({"msg": "Mover not found"}), 404
    
    slots = Availability.query.filter_by(user_id=user_id).all()
    return jsonify([slot.to_dict() for slot in slots]), 200


"""
    this route deals with deleting an availability slot for the logged-in mover.

    @param {int} slot_id - the ID of the slot that needs to be deleted
    @return {Response} - a JSON object with the message with success or error with the corresponding status code   
"""

@auth_bp.route('/user/availability/<int:slot_id>', methods=['DELETE'])
@jwt_required()
def delete_availability(slot_id):
    # extract the user ID from JSON Web Token, and get the time slot being deleted from database
    user_id = get_jwt_identity()
    slot = Availability.query.get(slot_id)

    # if the user id in the slot doesnt match or slot is not existing, then error
    if not slot:
        return jsonify({"msg": "Availability slot not found"}), 404

    if slot.user_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    # remove time slot from databse and return success status
    db.session.delete(slot)
    db.session.commit()

    return jsonify({"msg": "Availability deleted successfully"}), 200
    
"""
    this route serves the profile picture from the UPLOAD_FOLDER folder 

    @param {string} filename - the name of the file to be found
    @return {Response} - the file being retrieved
"""

@auth_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
