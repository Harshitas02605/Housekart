from main import app
from application.models import db, Role
with app.app_context():
    db.create_all()

    admin = Role(id='admin', name='Admin', description='Admin description')
    db.session.add(admin)

    customer = Role(id='customer', name='Customer', description= 'Customer description')
    db.session.add(customer)

    serviceprofessional = Role(id='serviceprofessional', name='ServiceProfessional', description='ServiceProfessional description')
    db.session.add(serviceprofessional)

    db.session.commit()
    