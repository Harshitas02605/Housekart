from flask import current_app as app
from flask_security import  auth_required, roles_required
from application.models import db, User
from flask import current_app as app, jsonify, request
from application.security import datastore
from werkzeug.security import check_password_hash


@app.get('/')
def home():
    return "hello world"

@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def adminpage():
    return "Hello Admin"

@app.get('/approve_professional/professional/<int:id>')
@auth_required("token")
@roles_required("admin")
def approve_professional(id):
    professional = User.query.get(id)
    print(professional.roles)
    if not professional or 'serviceprofessional' not in professional.roles:
        return jsonify({"message":"Professional not found"}), 404
    professional.active = True
    db.session.commit()
    return jsonify({"message":"Professional was approved successfully"})

@app.post('/user_login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message":"Email not provided"}), 400
    
    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message":"User Not Found"}), 404
    
    
    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token":user.get_auth_token(),
                        "email":user.email,
                        "role":user.roles[0].name})

    else:
        return jsonify({"message":"Wrong Password"}),400
    
