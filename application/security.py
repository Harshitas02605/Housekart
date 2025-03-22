from application.models import db, User, Role
from flask_security import SQLAlchemyUserDatastore
datastore = SQLAlchemyUserDatastore(db, User, Role)
# security = Security(app, user_datastore) # isko hatana pad sakta
