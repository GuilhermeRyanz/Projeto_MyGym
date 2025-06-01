import os
from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_gym.settings')

app = Celery('my_gym')
app.conf.enable_utc = False
app.config_from_object(settings, namespace='CELERY')
app.autodiscover_tasks()

print("Broker configurado:", app.conf.broker_url)
print("Backend configurado:", app.conf.result_backend)