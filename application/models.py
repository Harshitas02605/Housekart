from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

# Admin Model
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), default='Admin', nullable=False)

# Service Professional Model
class ServiceProfessional(db.Model):
    id = db.Column(db.Integer, primary_key=True)  
    email = db.Column(db.String(255), unique=True, nullable=False)  
    full_name = db.Column(db.String(255), nullable=False)  
    age = db.Column(db.Integer, nullable=True)
    password = db.Column(db.String(255), nullable=False) 
    contact = db.Column(db.String(15), nullable=False)
    service_type = db.Column(db.String(255), nullable=False)  
    service_description = db.Column(db.Text, nullable=False)  
    experience = db.Column(db.String(255), nullable=False)  
    document = db.Column(db.String(255), nullable=False)  
    address = db.Column(db.String(255), nullable=False)  
    pincode = db.Column(db.String(6), nullable=False)  
    date_created = db.Column(db.Date, nullable=False, default=datetime.now().date)  
    is_blocked = db.Column(db.Boolean, default=False)  
    is_approved = db.Column(db.Boolean, default=False)

# Customer Model
class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)  
    email = db.Column(db.String(255), unique=True, nullable=False)  
    full_name = db.Column(db.String(255), nullable=False)  
    password = db.Column(db.String(255), nullable=False)
    contact = db.Column(db.String(15), nullable=False)  
    address = db.Column(db.String(255), nullable=False)  
    pincode = db.Column(db.String(6), nullable=False)  
    date_created = db.Column(db.Date, nullable=False, default=datetime.now().date)  
    is_blocked = db.Column(db.Boolean, default=False)  

# Service Model
class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    time_required = db.Column(db.String(50))
    description = db.Column(db.String(255))

# Service Request Model
class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('service_professional.id'))
    date_of_request = db.Column(db.Date, default=datetime.now().date)
    date_of_completion = db.Column(db.Date, nullable=True)
    service_status = db.Column(db.String(20), default='requested', nullable=False)
    remarks = db.Column(db.String(255))

    service = db.relationship('Service', backref=db.backref('service_requests', lazy=True))
    customer = db.relationship('Customer', backref=db.backref('service_requests', lazy=True))
    professional = db.relationship('ServiceProfessional', backref=db.backref('service_requests', lazy=True))

# Roles and Users for Flask-Security
roles_users = db.Table('roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

class Role(db.Model, RoleMixin):
    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))
