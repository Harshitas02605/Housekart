from main import app
from application.security import datastore
from application.models import db, Role
from werkzeug.security import generate_password_hash
try:
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")

        admin_role = datastore.find_or_create_role(name="admin", description="User is an Admin")
        customer_role = datastore.find_or_create_role(name="customer", description="User is a Customer")
        professional_role = datastore.find_or_create_role(name="serviceprofessional", description="User is a Service Professional")
        db.session.commit()

        print("Roles added successfully!")

        if not datastore.find_user(email="admin@housekart.com"):
            datastore.create_user(email="admin@housekart.com", password=generate_password_hash("admin"), roles=[admin_role])
        db.session.commit()
        print("Users and Roles created successfully!")

except Exception as e:
    print(f"Error Occurred: {e}")


   
    