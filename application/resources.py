from flask_restful import Resource, Api, reqparse, fields, marshal_with
from application.models import db, Service, ServiceProfessional, ServiceRequest, Customer


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

#customerparser
customer_parser = reqparse.RequestParser()
customer_parser.add_argument('email', type=str, required=True, help='Email cannot be blank')
customer_parser.add_argument('full_name', type=str, required=True, help='Full name cannot be blank')
customer_parser.add_argument('password', type=str, required=True, help='Password cannot be blank')
customer_parser.add_argument('contact', type=str, required=True, help='Contact cannot be blank')
customer_parser.add_argument('address', type=str, required=True, help='Address cannot be blank')
customer_parser.add_argument('pincode', type=str, required=True, help='Pincode cannot be blank')

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
    'date_created': fields.String(attribute=lambda x: x.date_created.strftime('%Y-%m-%d')),
    'is_blocked': fields.Boolean,
    'is_approved': fields.Boolean
}

# Customer Fields
customer_fields = {
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
    
    def post(self):
        args = service_professional_parser.parse_args()
        service_professional = ServiceProfessional(**args)
        db.session.add(service_professional)
        db.session.commit()
        return {'message' : 'Service Professional was successfully added to database'}

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
        return {'message' : 'Customer was successfully added to database'}

class ServiceAPI(Resource):
    @marshal_with(service_fields)
    def get(self):
        all_services = Service.query.all()
        return all_services
    
    def post(self):
        args = service_parser.parse_args()
        service = Service(**args)
        db.session.add(service)
        db.session.commit()
        return {'message' : 'Service was successfully added to database'}

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