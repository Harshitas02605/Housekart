from flask import current_app as app, render_template
from flask_security import  auth_required, roles_required
from application.models import db, User, Service, ServiceRequest
from flask import current_app as app, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from application.security import datastore
from application.models import db, User, Customer, ServiceProfessional
from flask import send_from_directory
from datetime import datetime


@app.get('/')
def home():
    return render_template("index.html")

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

@app.get('/admin_backend')
@auth_required("token")
@roles_required("admin")
def adminpage():
    all_active_customers = User.query.all()
    return jsonify({"all_active_customers":all_active_customers})


@app.post('/approve_user/user/<int:id>')
@auth_required("token")
@roles_required("admin")
def approve_professional(id):
    user = User.query.get(id)
    if not user :
        return jsonify({"message":"User not found"}), 404
    user.active = True
    db.session.commit()
    return jsonify({"message":"User was approved successfully"})

@app.post('/block_user/user/<int:id>')
@auth_required("token")
@roles_required("admin")
def block_professional(id):
    user = User.query.get(id)
    print(user.roles)
    if not user:
        return jsonify({"message":"User not found"}), 404
    user.active = False
    db.session.commit()
    return jsonify({"message":"User was blocked successfully"})


@app.post('/delete_user/user/<int:id>')
@auth_required("token")
@roles_required("admin")
def delete_professional(id):
    user = User.query.get(id)
    if not user :
        return jsonify({"message":"User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message":"User was deleted from databse successfully"})

@app.post('/user_login_backend')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message":"Email not provided"}), 400
    
    user = datastore.find_user(email=email)
 
    if not user:
        return jsonify({"message": "User not found"}), 404

    if user and not user.active:
        return jsonify({"message":"Service professional not approved yet"}), 404
    
    
    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token":user.get_auth_token(),
                        "email":user.email,
                        "role":user.roles[0].name,
                        "active":user.active,
                        "customer_id" : user.customer[0].id if user.customer else None,
                        "professional_id":user.service_professional[0].id if user.service_professional else None
}),200
    else:
        return jsonify({"message":"Wrong Password"}),400
    

@app.route('/create_user_backend', methods=['POST'])
def create_user():
    try:
        data = request.get_json()

        role = data.get('role', '')
        email = data.get('email', '')
        password = data.get('password', '')

        if role == 'customer':
            active_status = True
        elif role == 'serviceprofessional':
            active_status = False
        else:
            return jsonify({"error": "Invalid role"}), 400

        if not datastore.find_user(email=email):
            datastore.create_user(email=email, password=generate_password_hash(password), roles=[role], active=active_status)
            db.session.commit()
            user = datastore.find_user(email=email)
            print(user)
            return jsonify({"token":user.get_auth_token(),
                        "password":user.password,
                        "role":user.roles[0].name, 
                        "email":user.email,
                        "user_id":user.id}),200
        
        else:
            user=None
            return jsonify({"message":"User Already Exists"}), 400

        
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

@app.get('/user_details/<int:user_id>')
@app.get('/user_details')
@auth_required('token')
def get_user_details(user_id=None):
    # Fetch user(s) based on user_id
    if user_id is not None:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        users = [user]
    else:
        users = User.query.all()

    # Extract user data safely
    def get_user_data(user):
        return {
            "id": user.id,
            "email": user.email,
            "active": user.active,
            "roles": [role.name for role in user.roles],
            "customer": {
                "email": user.customer[0].email,
                "full_name": user.customer[0].full_name ,
                "contact": user.customer[0].contact ,
                "address": user.customer[0].address ,
                "pincode": user.customer[0].pincode ,
                "date_created": user.customer[0].date_created
            } 
            if user.customer else None,
            "service_professional": {
                "email": user.service_professional[0].email ,
                "full_name": user.service_professional[0].full_name ,
                "age": user.service_professional[0].age ,
                "contact": user.service_professional[0].contact ,
                "service_type": user.service_professional[0].service_type ,
                "service_description": user.service_professional[0].service_description ,
                "experience": user.service_professional[0].experience ,
                "document": user.service_professional[0].document ,
                "address": user.service_professional[0].address ,
                "pincode": user.service_professional[0].pincode ,
                "date_created": user.service_professional[0].date_created
            } if user.service_professional else None,
        }

    return jsonify([get_user_data(user) for user in users])


    
@app.post('/customer_signup_backend')
def customer_signup():
    data = request.get_json()
    print(data)
    # customer = Customer(**data)

    # db.session.add(customer)
    # db.session.commit()


@app.post('/admin_add_service')
@app.put('/admin_add_service/<int:id>')
@app.delete('/admin_add_service/<int:id>')
@auth_required("token")
@roles_required("admin")
def manage_service(id=None):
    try:
        if request.method == 'POST':
            # Add new service
            args = request.get_json()
            if not args:
                return jsonify({"message": "No data provided"}), 400
            
            service = Service(**args)
            db.session.add(service)
            db.session.commit()
            return jsonify({"message": "Service added successfully"}), 201
        
        elif request.method == 'PUT':
            # Update service
            service = Service.query.get(id)
            if not service:
                return jsonify({"error": "Service not found"}), 404

            args = request.get_json()
            if not args:
                return jsonify({"message": "No data provided"}), 400

            for key, value in args.items():
                setattr(service, key, value)

            db.session.commit()
            return jsonify({"message": "Service updated successfully"}), 200
        
        elif request.method == 'DELETE':
            # Delete service
            service = Service.query.get(id)
            if not service:
                return jsonify({"error": "Service not found"}), 404

            db.session.delete(service)
            db.session.commit()
            return jsonify({"message": "Service deleted successfully"}), 200
    
    except Exception as e:
        return jsonify({"message": str(e)}), 500



@app.route('/admin_get_service', methods=['GET'])
def get_service():
    services = Service.query.all()

    service_data = [
        {
        'id': service.id,
        'name': service.name,
        'description': service.description,
        'time_required': service.time_required,
        'price': service.price
    } 
    for service in services]

    return jsonify(service_data)

@auth_required("token")
@app.route('/get_servicerequest', methods=['GET'])
@app.route('/get_servicerequest/<int:id>', methods=['GET'])
@app.route('/service_requests', methods=['GET'])
def get_service_requests():
    service_requests = db.session.query(ServiceRequest, Customer, ServiceProfessional, Service)\
        .join(Customer, ServiceRequest.customer_id == Customer.id)\
        .join(Service, ServiceRequest.service_id == Service.id)\
        .outerjoin(ServiceProfessional, ServiceRequest.professional_id == ServiceProfessional.id)\
        .all()

    result = []
    for sr, customer, professional, service in service_requests:
        result.append({
            "request_id": sr.id,
            "service_name": service.name,
            "customer_name": customer.full_name,
            "customer_contact": customer.contact,
            "professional_name": professional.full_name if professional else "Pending",
            "professional_contact": professional.contact if professional else "N/A",
            "status": sr.service_status,
            "date_of_request": sr.date_of_request if sr.date_of_request else 'N/A',
            "date_of_completion": sr.date_of_completion if sr.date_of_completion else 'N/A',
            "remarks": sr.remarks if sr.remarks else 'Pending'
        })


    return jsonify(result)

@auth_required("token")
@app.route('/get_servicerequest_customer', methods=['GET'])
@app.route('/get_servicerequest_customer/<int:id>', methods=['GET'])
@app.route('/service_requests_customer', methods=['GET'])
def get_service_requests_customer(id=None):
    servicerequest = ServiceRequest.query.filter_by(customer_id=id).all()
    service_request_list = []
    for sr in servicerequest:
        service_request_list.append({
            'id':sr.id,
        'service_id': sr.service_id,
        'customer_id': sr.customer_id,
        'professional_name': sr.professional.full_name if sr.professional else 'null',
        'professional_contact': sr.professional.contact if sr.professional else 'null',
        'professional_experience': sr.professional.experience if sr.professional else 'null',
        'professional_service_description': sr.professional.service_description if sr.professional else 'null',
        'date_of_request': sr.date_of_request if sr.date_of_request else 'null',
        'date_of_completion': sr.date_of_completion if sr.date_of_completion else 'null',
        'service_status': sr.service_status if sr.service_status else 'null',
        'remarks': sr.remarks if sr.remarks else 'null'
    })
    return jsonify(service_request_list)




@auth_required("token")
@app.route('/get_serviceprofessional/<string:service>', methods=['GET'])
def get_service_details_professional(service=None):
    print(service)
    service_id = Service.query.filter_by(name=service).first().id
    serviceprofessional = ServiceProfessional.query.filter_by(service_type=service).all()
    service_professional_list = []
    for sp in serviceprofessional:
        service_professional_list.append({
        'id':sp.id,
        'service_id':service_id,
        'full_name': sp.full_name,
        'email': sp.email,
        'contact': sp.contact,
        'age': sp.age,
        'service_description': sp.service_description,
        'service_type': sp.service_type,
        'experience': sp.experience,
        'pincode': sp.pincode,
        'address': sp.address,
    })
    print(service_professional_list)
    return jsonify(service_professional_list)

@auth_required("token")
@app.route('/get_serviceprofessional_by_location/<string:location>', methods=['GET'])
def get_service_details_by_location(location=None):

    serviceprofessional = ServiceProfessional.query.filter(ServiceProfessional.address.ilike(f"%{location}%")).all()
    
    return jsonify([{
        'id': sp.id,
        'service_id': sp.service.id,
        'full_name': sp.full_name,
        'email': sp.email,
        'contact': sp.contact,
        'age': sp.age,
        'service_description': sp.service_description,
        'service_type': sp.service_type,
        'experience': sp.experience,
        'pincode': sp.pincode,
        'address': sp.address,
    } for sp in serviceprofessional])


@auth_required("token")
@app.route('/get_serviceprofessional_by_pincode/<string:pincode>', methods=['GET'])
def get_service_details_by_pincode(pincode=None):
    serviceprofessionals = ServiceProfessional.query.filter_by(pincode=pincode).all()


    if not serviceprofessionals:
        return jsonify({"message": "No professionals found for this pincode"}), 404

    return jsonify([{
        'id': sp.id,
       'service_id': sp.service.id,
        'full_name': sp.full_name,
        'email': sp.email,
        'age': sp.age,
        'contact': sp.contact,
        'service_description': sp.service_description,
        'service_type': sp.service_type,
        'experience': sp.experience,
        'pincode': sp.pincode,
        'address': sp.address,
    } for sp in serviceprofessionals])





@auth_required("token")
@app.route('/get_open_services_for_professionals/<int:id>', methods=['GET'])
def get_open_services_for_professionals(id=None):
    open_requests = ServiceRequest.query.filter_by(professional_id=id, service_status='Requested').all()
    open_requests_list =[]
    for open_req in open_requests:
        open_requests_list.append({
            'id':open_req.id,
    'service_id': open_req.service_id,
    'customer_id': open_req.customer_id,
    'professional_id': open_req.professional_id,
    'date_of_request': open_req.date_of_request if open_req.date_of_request else 'null',
    'date_of_completion': open_req.date_of_completion if open_req.date_of_completion else 'null',
    'service_status':open_req.service_status,
    'remarks':open_req.remarks,
    'customer_name':open_req.customer.full_name,
    'customer_address':open_req.customer.address,
    'customer_pincode':open_req.customer.pincode,
    'customer_contact':open_req.customer.contact,
})
    return jsonify(open_requests_list), 200

@auth_required("token")
@app.route('/get_closed_services_for_professionals/<int:id>', methods=['GET'])
def get_closed_services_for_professionals(id=None):
    try:
        closed_requests = ServiceRequest.query.filter_by(professional_id=id, service_status='Completed').all()
        
        if not closed_requests:
            return jsonify({"message": "No closed services found for this professional."}), 404
        
        closed_requests_list = []
        for closed_req in closed_requests:
            closed_requests_list.append({
                'id': closed_req.id,
                'service_id': closed_req.service_id,
                'customer_id': closed_req.customer_id,
                'professional_id': closed_req.professional_id,
                'date_of_request': closed_req.date_of_request if closed_req.date_of_request else 'null',
                'date_of_completion': closed_req.date_of_completion if closed_req.date_of_completion else 'null',
                'service_status': closed_req.service_status,
                'remarks': closed_req.remarks,
                'customer_name': closed_req.customer.full_name,
                'customer_address': closed_req.customer.address,
                'customer_pincode': closed_req.customer.pincode,
                'customer_contact': closed_req.customer.contact,
            })
        
        return jsonify(closed_requests_list), 200
    
    except Exception as e:
        return jsonify({"message": f"An error occurred: {e}"}), 500


@auth_required("token")
@app.route('/get_ongoing_services_for_professionals/<int:id>', methods=['GET'])
def get_ongoing_services_for_professionals(id=None):
    ongoing_requests = ServiceRequest.query.filter_by(professional_id=id, service_status='Pending').all()
    ongoing_requests_list =[]
    for ongoing_req in ongoing_requests:
        ongoing_requests_list.append({
            'id':ongoing_req.id,
    'service_id': ongoing_req.service_id,
    'customer_id': ongoing_req.customer_id,
    'professional_id': ongoing_req.professional_id,
    'date_of_request': ongoing_req.date_of_request if ongoing_req.date_of_request else 'null',
    'date_of_completion': ongoing_req.date_of_completion if ongoing_req.date_of_completion else 'null',
    'service_status':ongoing_req.service_status,
    'remarks':ongoing_req.remarks,
    'customer_name':ongoing_req.customer.full_name,
    'customer_address':ongoing_req.customer.address,
    'customer_pincode':ongoing_req.customer.pincode,
    'customer_contact':ongoing_req.customer.contact,
})
    return jsonify(ongoing_requests_list), 200

@auth_required("token")
@app.route('/delete_request_from_professional/<int:id>',methods=['DELETE'])
def delete_request_from_professional(id=None):
    try:
        sr = ServiceRequest.query.get(id)
        db.session.delete(sr)
        db.session.commit()
        return jsonify({"message":"Service Request Deleted"}), 200
    
    except Exception as e:
        return jsonify({'message':f'Error occured{e}'})
    

@auth_required("token")
@app.route('/accept_request_from_professional/<int:id>', methods=['POST'])
def accept_request_from_professional(id=None):
    try:
        sr = ServiceRequest.query.get(id)
        
        
        ongoing_request = ServiceRequest.query.filter_by(professional_id=sr.professional_id, service_status='Pending').first()
        if ongoing_request:
            return jsonify({"message": "You already have a pending service request."}), 400

        sr.service_status = 'Pending'
        db.session.commit()
        return jsonify({"message": "Service request accepted."}), 200
    
    except Exception as e:
        return jsonify({'message': f'Error occurred: {e}'}), 500



@auth_required("token")
@app.route('/get_service_request_from_customer/<int:id>', methods=['GET'])
def get_service_request_for_customer(id):
    try:
        sr = ServiceRequest.query.get(id)
        if not sr:
            return jsonify({"error": "Service Request not found"}), 404
        
        professional_name = sr.professional.full_name if sr.professional else 'N/A'
        customer_name = sr.customer.full_name if sr.customer else 'N/A'
        service_name = sr.service.name if sr.service else 'N/A'
        service_price = sr.service.price if sr.service else 'N/A'
        service_time = sr.service.time_required if sr.service else 'N/A'
        
        return jsonify({
            "id": sr.id,
            "service_id": sr.service_id,
            "service_name": service_name,
            "customer_id": sr.customer_id,
            "customer_name": customer_name,
            "professional_id": sr.professional_id,
            "professional_name": professional_name,
            "date_of_request": sr.date_of_request if sr.date_of_request else 'N/A',
            "date_of_completion": sr.date_of_completion if sr.date_of_completion else 'N/A',
            "service_status": sr.service_status,
            "remarks": sr.remarks,
            "service_price":service_price,
            "service_time":service_time
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error occurred: {e}'}), 500

@app.route('/close_service_request_from_customer', methods=['PUT'])
def close_service_request_customer():
    data = request.get_json()
    service_request = ServiceRequest.query.get(data.get('id'))
    if not service_request:
        return jsonify({'error': 'Service request not found'}), 404

    for key, value in data.items():
        setattr(service_request, key, value)
        
    db.session.commit()
    return jsonify({'message': 'Service request updated successfully'})

@auth_required('token')
@app.route('/close_request_from_professional/<int:id>', methods=['POST'])
def close_service_request_professional(id):
    service_request = ServiceRequest.query.get(id)
    if not service_request:
        return jsonify({'error': 'Service request not found'}), 404

    service_request.service_status = 'Completed'
    service_request.date_of_completion = datetime.now().date().strftime('%Y-%m-%d')
    service_request.remarks = "Service was closed by Professional"
        
    db.session.commit()
    return jsonify({'message': 'Service request closed successfully'}) , 200



@app.route('/get_searchresult_professional_by_location/<string:location>', methods=['GET'])
def search_by_location(location):
    try:
        closed_requests = db.session.query(ServiceRequest).join(Customer).filter(
            ServiceRequest.service_status == 'Completed',
            Customer.address.ilike(f"%{location}%")
        ).all()
        
        if not closed_requests:
            return jsonify({"message": "No closed services found for this professional."}), 404
        
        closed_requests_list = []
        for closed_req in closed_requests:
            closed_requests_list.append({
                'id': closed_req.id,
                'service_id': closed_req.service_id,
                'customer_id': closed_req.customer_id,
                'professional_id': closed_req.professional_id,
                'date_of_request': closed_req.date_of_request if closed_req.date_of_request else 'null',
                'date_of_completion': closed_req.date_of_completion if closed_req.date_of_completion else 'null',
                'service_status': closed_req.service_status,
                'remarks': closed_req.remarks,
                'customer_name': closed_req.customer.full_name,
                'customer_address': closed_req.customer.address,
                'customer_pincode': closed_req.customer.pincode,
                'customer_contact': closed_req.customer.contact,
            })

        print(closed_requests_list)
        
        return jsonify(closed_requests_list), 200
    
    except Exception as e:
        return jsonify({"message": f"An error occurred: {e}"}), 500



@app.route('/get_searchresult_professional_by_pincode/<string:pincode>', methods=['GET'])
def search_by_pincode(pincode):
    try:
        closed_requests = db.session.query(ServiceRequest).join(Customer).filter(
            ServiceRequest.service_status == 'Completed',
            Customer.pincode.ilike(f"%{pincode}%")
        ).all()
        
        if not closed_requests:
            return jsonify({"message": "No closed services found for this professional."}), 404
        
        closed_requests_list = []
        for closed_req in closed_requests:
            closed_requests_list.append({
                'id': closed_req.id,
                'service_id': closed_req.service_id,
                'customer_id': closed_req.customer_id,
                'professional_id': closed_req.professional_id,
                'date_of_request': closed_req.date_of_request if closed_req.date_of_request else 'null',
                'date_of_completion': closed_req.date_of_completion if closed_req.date_of_completion else 'null',
                'service_status': closed_req.service_status,
                'remarks': closed_req.remarks,
                'customer_name': closed_req.customer.full_name,
                'customer_address': closed_req.customer.address,
                'customer_pincode': closed_req.customer.pincode,
                'customer_contact': closed_req.customer.contact,
            })

        print(closed_requests_list)
        
        return jsonify(closed_requests_list), 200
    
    except Exception as e:
        return jsonify({"message": f"An error occurred: {e}"}), 500


@app.route('/editservicecustomer/<int:id>', methods=['POST'])
def editservicecustomer(id):
    try:
        data = request.json
        sr = ServiceRequest.query.get(id)

        if not sr:
            return jsonify({"error": "Service Request not found"}), 404
        
    
        sr.date_of_request = data.get('date_of_request', sr.date_of_completion)
   

        db.session.commit()
        return jsonify({"message": "Service updated successfully!"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_required("token")
@app.route('/service_requests_customer_count', methods=['GET'])
@app.route('/service_requests_customer_count/<int:customer_id>', methods=['GET'])
def service_requests_customer_count(customer_id=None):
    try:
        if customer_id:
            requested_count = ServiceRequest.query.filter_by(service_status='Requested',customer_id=customer_id).count()
            pending_count = ServiceRequest.query.filter_by(service_status='Pending',customer_id=customer_id).count()
            completed_count = ServiceRequest.query.filter_by(service_status='Completed',customer_id=customer_id).count()
        else:
            requested_count = ServiceRequest.query.filter_by(service_status='Requested').count()
            pending_count = ServiceRequest.query.filter_by(service_status='Pending').count()
            completed_count = ServiceRequest.query.filter_by(service_status='Completed').count()

        return jsonify({
                "Requested": requested_count,
                "Pending": pending_count,
                "Completed": completed_count
            }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@auth_required("token")
@app.route('/service_requests_professional_count/<int:professional_id>', methods=['GET'])
def service_requests_professional_count(professional_id=None):
    try:
        if professional_id:
            requested_count = ServiceRequest.query.filter_by(service_status='Requested',professional_id=professional_id).count()
            pending_count = ServiceRequest.query.filter_by(service_status='Pending',professional_id=professional_id).count()
            completed_count = ServiceRequest.query.filter_by(service_status='Completed',professional_id=professional_id).count()
        else:
            jsonify({"message":"No Professional Found"})

        return jsonify({
                "Requested": requested_count,
                "Pending": pending_count,
                "Completed": completed_count
            }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
