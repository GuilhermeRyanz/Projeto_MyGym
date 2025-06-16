# settings.py do Microsserviço (gym_face)

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-fallback-key-for-dev')
DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 't')

ALLOWED_HOSTS = ['*']

# --- APLICAÇÃO CORRIGIDA ---
# Adicionamos de volta os apps necessários pelo Django e DRF.
INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'checkin', # Seu app do microsserviço
]

# --- MIDDLEWARE CORRIGIDO ---
# Adicionamos de volta os middlewares de sessão e autenticação.
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware', # Adicionado para compatibilidade completa
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'gym_face.urls'
WSGI_APPLICATION = 'gym_face.wsgi.application'

# --- BANCO DE DADOS CORRIGIDO ---
# Usamos um banco de dados leve (sqlite3) apenas para as tabelas internas do Django.
# Ele será criado automaticamente na pasta do projeto como 'db.sqlite3'.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# --- REMOVER AUTENTICAÇÃO PADRÃO ---
# Para evitar que o DRF tente autenticar, já que este serviço é público.
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
}


# ... (outras configurações como LANGUAGE_CODE, TIME_ZONE, etc., podem permanecer) ...
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Manaus'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
]

# --- CONFIGURAÇÕES DO MINIO ---
MINIO_STORAGE_ENDPOINT = os.getenv('MINIO_ENDPOINT_URL')
MINIO_STORAGE_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY')
MINIO_STORAGE_SECRET_KEY = os.getenv('MINIO_SECRET_KEY')
MINIO_STORAGE_BUCKET_NAME = os.getenv('MINIO_BUCKET_NAME')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
