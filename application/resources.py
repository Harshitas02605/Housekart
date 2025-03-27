from flask_restful import Resource, Api, reqparse, fields, marshal_with
from application.models import db, Service, ServiceProfessional, ServiceRequest, Customer
from flask_security import  auth_required, roles_required
from flask import jsonify
import os
from flask import request, current_app
from werkzeug.utils import secure_filename




api = Api(prefix='/api')

#serviceprofessionalparser
service_professional_parser = reqparse.RequestParser()
service_professional_parser.add_argument('email', type=str, required=True, help='Email cannot be blank')
service_professional_parser.add_argument('full_name', type=str, required=True, help='Full name cannot be blank')
service_professional_parser.add_argument('age', type=int, required=False)
service_professional_parser.add_argument('password', type=str, required=True, help='Password cannot be blank')
service_professional_parser.add_argument('contact', type=str, required=True, help='Contact cannot be blank')
service_professional_parser.add_argument('service_type', type=str, required=True, help='Service type cannot be blank')
service_professional_parser.add_argument('service_description', type=str, required=True, help='Service description cannot be blank')
service_professional_parser.add_argument('experience', type=str, required=True, help='Experience cannot be blank')
service_professional_parser.add_argument('document', type=str, required=True, help='Document cannot be blank')
service_professional_parser.add_argument('address', type=str, required=True, help='Address cannot be blank')
service_professional_parser.add_argument('pincode', type=str, required=True, help='Pincode cannot be blank')
service_professional_parser.add_argument('user_id', type=str, required=True, help='User Id cannot be blank')

#customerparser
customer_parser = reqparse.RequestParser()
customer_parser.add_argument('email', type=str, required=True, help='Email cannot be blank')
customer_parser.add_argument('full_name', type=str, required=True, help='Full name cannot be blank')
customer_parser.add_argument('password', type=str, required=True, help='Password cannot be blank')
customer_parser.add_argument('contact', type=str, required=True, help='Contact cannot be blank')
customer_parser.add_argument('address', type=str, required=True, help='Address cannot be blank')
customer_parser.add_argument('pincode', type=str, required=True, help='Pincode cannot be blank')
customer_parser.add_argument('user_id', type=str, required=True, help='User Id cannot be blank')

#serviceparser
service_parser = reqparse.RequestParser()
service_parser.add_argument('name', type=str, required=True, help='Service name cannot be blank')
service_parser.add_argument('price', type=float, required=True, help='Price cannot be blank')
service_parser.add_argument('time_required', type=str, required=False)
service_parser.add_argument('description', type=str, required=False)

#servicerequestparser
service_request_parser = reqparse.RequestParser()
service_request_parser.add_argument('service_id', type=int, required=True, help='Service ID cannot be blank')
service_request_parser.add_argument('customer_id', type=int, required=True, help='Customer ID cannot be blank')
service_request_parser.add_argument('professional_id', type=int, required=False)
service_request_parser.add_argument('date_of_completion', type=str, required=False)
service_request_parser.add_argument('service_status', type=str, required=False)
service_request_parser.add_argument('remarks', type=str, required=False)


#Fields
# Service Professional Fields
service_professional_fields = {
    'user_id':fields.String,
    'email': fields.String,
    'full_name': fields.String,
    'age': fields.Integer,
    'password': fields.String,
    'contact': fields.String,
    'service_type': fields.String,
    'service_description': fields.String,
    'experience': fields.String,
    'document': fields.String,
    'address': fields.String,
    'pincode': fields.String,
    'date_created': fields.String(attribute=lambda x: x.get('date_created').strftime('%Y-%m-%d') if x.get('date_created') else None),
    'is_blocked': fields.Boolean,
    'is_approved': fields.Boolean
}

# Customer Fields
customer_fields = {
    'user_id':fields.String,
    'email': fields.String,
    'full_name': fields.String,
    'password': fields.String,
    'contact': fields.String,
    'address': fields.String,
    'pincode': fields.String,
    'date_created': fields.String(attribute=lambda x: x.date_created.strftime('%Y-%m-%d')),
    'is_blocked': fields.Boolean
}

# Service Fields
service_fields = {
    'name': fields.String,
    'price': fields.Float,
    'time_required': fields.String,
    'description': fields.String
}

# Service Request Fields
service_request_fields = {
    'service_id': fields.Integer,
    'customer_id': fields.Integer,
    'professional_id': fields.Integer,
    'date_of_request': fields.String(attribute=lambda x: x.date_of_request.strftime('%Y-%m-%d')),
    'date_of_completion': fields.String(attribute=lambda x: x.date_of_completion.strftime('%Y-%m-%d') if x.date_of_completion else None),
    'service_status': fields.String,
    'remarks': fields.String
}




class ServiceProfessionalAPI(Resource):
    @marshal_with(service_professional_fields)
    def get(self):
        all_service_professional = ServiceProfessional.query.all()
        return all_service_professional
    

    @marshal_with(service_professional_fields)
    def post(self):
        # Extract form data
        args = request.form.to_dict()

        # Extract and save file
        uploaded_file = request.files.get('document')
        if not uploaded_file:
            return {'error': 'Document is required'}, 400
        
        # Access UPLOAD_FOLDER using current_app
        UPLOAD_FOLDER = current_app.config['UPLOAD_FOLDER']
        filename = secure_filename(f"{args['full_name']}_document.{uploaded_file.filename.split('.')[-1]}")
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        uploaded_file.save(file_path)
        args['document'] = filename
        
        service_professional = ServiceProfessional(**args)
        db.session.add(service_professional)
        db.session.commit()
        return {'message': 'Service Professional was successfully added to database'}


class CustomerAPI(Resource):
    @marshal_with(customer_fields)
    def get(self):
        all_customers = Customer.query.all()
        return all_customers
    
    def post(self):
        args = customer_parser.parse_args()
        customer = Customer(**args)
        db.session.add(customer)
        db.session.commit()
        return {'message' : 'Customer was successfully added to database'}, 201

class ServiceAPI(Resource):
    @auth_required('token')
    @marshal_with(service_fields)
    def get(self):
        all_services = Service.query.all()
        services_data = [
            {
                "id": service.id,
                "name": service.name,
                "description": service.description,
                "price": service.price,
                "time_required": service.time_required
            }
            for service in all_services
        ]
        return jsonify(services_data)
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = service_parser.parse_args()
        service = Service(**args)
        db.session.add(service)
        db.session.commit()
        return {'message': 'Service was successfully added to the database'}

    @auth_required('token')
    @roles_required('admin')
    def put(self, service_id):
        args = service_parser.parse_args()
        service = Service.query.get(service_id)
        if not service:
            return {'error': 'Service not found'}, 404
        for key, value in args.items():
            setattr(service, key, value)
        db.session.commit()
        return {'message': 'Service updated successfully'}

    @auth_required('token')
    @roles_required('admin')
    def delete(self, service_id):
        service = Service.query.get(service_id)
        if not service:
            return {'error': 'Service not found'}, 404
        db.session.delete(service)
        db.session.commit()
        return {'message': 'Service deleted successfully'}


class ServiceRequestAPI(Resource):
    @marshal_with(service_request_fields)
    def get(self):
        all_servicerequests = ServiceRequest.query.all()
        return all_servicerequests
    
    def post(self):
        args = service_request_parser.parse_args()
        service_request = ServiceRequest(**args)
        db.session.add(service_request)
        db.session.commit()
        return {'message' : 'Service Request was successfully added to database'}

    
    

    
api.add_resource(ServiceProfessionalAPI, '/serviceprofessional')
api.add_resource(CustomerAPI, '/customer')
api.add_resource(ServiceAPI, '/service')
api.add_resource(ServiceRequestAPI, '/servicerequest')