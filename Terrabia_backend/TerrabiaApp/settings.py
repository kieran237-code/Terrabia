import os
from pathlib import Path
from datetime import timedelta
import dj_database_url
# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key secret in production!
SECRET_KEY = "django-insecure-change-this-key"

DEBUG = True

ALLOWED_HOSTS = ["*"]

# ------------------------
# Applications
# ------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "corsheaders",

    # Local apps
    "api",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # CORS
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "TerrabiaApp.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "TerrabiaApp.wsgi.application"

# --------------------------.
# Database (SQLite par défaut)
# ------------------------
# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.sqlite3",
#         "NAME": BASE_DIR / "db.sqlite3",
#     }
# }

# ------------------------
# Auth
# ------------------------
AUTH_USER_MODEL = "api.User"

# ------------------------
# Password validation
# ------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ------------------------
# Internationalization
# ------------------------
LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Africa/Douala"
USE_I18N = True
USE_TZ = True

# ------------------------
# Static & Media
# ------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ------------------------
# Django REST Framework
# ------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}


# ------------------------
# CORS
# ------------------------
CORS_ALLOW_ALL_ORIGINS = True
# ou limiter :
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
# ]

# ------------------------
# Default primary key field type
# ------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Dans TerrabiaApp/settings.py

# ...

# 1. Configuration des Hôtes Autorisés (IMPORTANT)
# Render définit l'URL de votre service Web (ex: https://terrabia-app.onrender.com)
ALLOWED_HOSTS = ['.onrender.com', 'localhost', '127.0.0.1'] 
# Vous pouvez aussi récupérer le nom exact de votre service Render pour plus de sécurité.

# 2. Configuration de la Base de Données
DATABASES = {
    'default': dj_database_url.config(
        # Récupère l'URL depuis la variable d'environnement
        default=os.environ.get('DATABASE_URL')
    )
}

# 3. Ajoutez la ligne pour le mode debug
# En production, DEBUG doit être à False
DEBUG = os.environ.get('DEBUG', 'False') == 'True'