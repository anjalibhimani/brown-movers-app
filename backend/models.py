# defines the User table structure for main database using SQLAlchemy 

from extensions import db
from datetime import datetime

"""
    represents a user in the database, stores info on normal users and movers. 

    Attributes in table:
        id (int) - primary key for the user (identifier)
        email (str) - the user's email address
        password_hash (str) - user's securely hashed password.
        first_name (str) - user's first name
        last_name (str) - user's last name
        graduation_year (int) - user's Brown grad year 
        is_service_provider (bool) - flag to indicate if user is a mover or not 
        services_offered (list) - list of services the user provides ('Moving', 'Packing', etc)
        hourly_rate (float) - user's rate for a full hour of service
        thirty_min_rate (float) - user's rate for 30-minute service
        profile_picture (str) - filename of the user's uploaded profile pic
        phone_number (str) - user's phone number if provided 
"""

class User(db.Model):
    # defining all the columns in the databse table
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    graduation_year = db.Column(db.Integer, nullable=False)
    is_service_provider = db.Column(db.Boolean, default=False)
    services_offered = db.Column(db.ARRAY(db.String(50)), default=list)  # Use default=list
    hourly_rate = db.Column(db.Float, default=0.0)
    thirty_min_rate = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    profile_picture = db.Column(db.String(255), nullable=True)  # New field for profile picture
    phone_number = db.Column(db.String(20), nullable=True)

class Availability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    user = db.relationship('User', backref=db.backref('availabilities', lazy=True, cascade="all, delete-orphan"))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat()
        }
        
    """
        this function serializes a User object into a dictionary
        
        @param self - the User instance
        @return {dict} - a dictionary representation of the user data 
    """
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'graduation_year': self.graduation_year,
            'is_service_provider': self.is_service_provider,
            'services_offered': self.services_offered,
            'hourly_rate': self.hourly_rate,
            'thirty_min_rate': self.thirty_min_rate,
            'profile_picture': self.profile_picture,
            'phone_number': self.phone_number 
        }
