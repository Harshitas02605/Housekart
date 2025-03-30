from celery import shared_task
from application.models import ServiceRequest
from sqlalchemy import func, case
from flask import render_template
import flask_excel as excel
from application.mail_service import send_message
from application.models import User, ServiceRequest,Customer, db, ServiceProfessional, Service

@shared_task(ignore_result=False)
def create_professional_closed_service_request_file():
    service_req = ServiceRequest.query.with_entities(ServiceRequest.service_id,
                                                     ServiceRequest.customer_id,
                                                     ServiceRequest.professional_id,
                                                     ServiceRequest.date_of_request, 
                                                     ServiceRequest.remarks).filter(ServiceRequest.remarks == "Service was closed by Professional").all()
    
    csv_output = excel.make_response_from_array(service_req, 
                                            column_names=['Service_ID','Customer_ID','Professional_ID','Request_Date','Remarks'],
                                            file_type='csv',
                                            file_name='close_requests_by_professional.csv'
                                           )
    filename = 'Close_Request_byProfessional_Details.csv'

    with open(filename, 'wb') as f:
        f.write(csv_output.data)

    return filename

@shared_task(ignore_result=True)
def monthly_mail_sending_to_customers(to, subject):

    query = db.session.query(
        Customer.email.label('customer_email'),
        Customer.full_name.label('customer_name'),
        func.count(ServiceRequest.id).label('total_requests'),
        func.sum(case((ServiceRequest.service_status == 'Completed', 1), else_=0)).label('completed_requests'),
        func.sum(case((ServiceRequest.service_status == 'Pending', 1), else_=0)).label('pending_requests'),
        func.sum(case((ServiceRequest.service_status == 'Requested', 1), else_=0)).label('requested_requests'),
        Service.name.label('service_name'),
        ServiceRequest.date_of_request,
        ServiceRequest.date_of_completion,
        ServiceProfessional.full_name.label('professional_name')
    ).join(Customer, ServiceRequest.customer_id == Customer.id)\
     .join(Service, ServiceRequest.service_id == Service.id)\
     .outerjoin(ServiceProfessional, ServiceRequest.professional_id == ServiceProfessional.id)\
     .group_by(Customer.email, Customer.full_name, Service.name, ServiceRequest.date_of_request, ServiceRequest.date_of_completion, ServiceProfessional.full_name)
    
    required_db = query.all()

    for customer in required_db:
        send_message(
        customer.customer_email,
        subject,
        render_template(
            'mail.html',
            customer_name=customer.customer_name,
            total_requests=customer.total_requests,
            completed_requests=customer.completed_requests,
            pending_requests=customer.pending_requests,
            services=customer.service_name
        ))
    return 'OK'

@shared_task(ignore_result=True)
def task_incomplete_mail_to_professional(to, subject):

    requested_professionals = db.session.query(
    ServiceProfessional.email, ServiceProfessional.full_name
).join(ServiceRequest, ServiceProfessional.id == ServiceRequest.professional_id
).filter(ServiceRequest.service_status == 'Requested'
).distinct().all()
    

    for professional in requested_professionals:
        professional_name = professional.full_name
        send_message(
        professional.email,
        subject,
        render_template(
            'remindermail.html',
            professional=professional_name
        ))
    return 'OK'
