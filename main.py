from flask import Flask
from application.models import db, User, Role
from application.resources import api
from config import DevelopmentConfig
from flask_security import SQLAlchemyUserDatastore, Security
from application.security import datastore
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import monthly_mail_sending_to_customers, task_incomplete_mail_to_professional
from application.instances import cache


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    app.security = Security(app, datastore)
    excel.init_excel(app)
    cache.init_app(app)
    with app.app_context():
        from application import views

    return app

app = create_app()
celery_app = celery_init_app(app)

@celery_app.on_after_configure.connect
def send_mails(sender, **kwargs):
    sender.add_periodic_task(crontab(hour=12, minute=26, day_of_month=29),monthly_mail_sending_to_customers.s(to='admin@housekart.com',subject='Previous Month Report Mail'))

@celery_app.on_after_configure.connect
def send_reminder_mail(sender, **kwargs):
    sender.add_periodic_task(crontab(hour=12, minute=26),task_incomplete_mail_to_professional.s(to='admin@housekart.com',subject='Service Pending Reminder❗'))

if __name__ == '__main__':
    app.run(debug=True)

