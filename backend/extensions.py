# initializes all the required shared Flask extensions like the database and JSON Web Token for backend files

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# to interact with database using python
db = SQLAlchemy()

# to hash passwords
bcrypt = Bcrypt()

# for authorization of routes
jwt = JWTManager()

# to allow and restrict frontend to make requests to backend on different domains 
cors = CORS()
