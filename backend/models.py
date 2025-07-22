from extensions import db
from datetime import datetime

class User(db.Model):
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
