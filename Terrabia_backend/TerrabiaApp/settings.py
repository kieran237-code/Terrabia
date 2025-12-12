import os
from pathlib import Path
from datetime import timedelta
import dj_database_url # Import pour gérer l'URL de la base de données PostgreSQL

# ----------------------------------------------------
# 1. PARAMÈTRES DE BASE ET SÉCURITÉ
# ----------------------------------------------------

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# L'API de Render définit la variable SECRET_KEY. 
# La version par défaut est pour le développement local si la variable n'existe pas.
SECRET_KEY = os.environ.get("SECRET_KEY", "django-insecure-change-this-key")

# Lis le statut de debug depuis la variable d'environnement (par défaut à False en production)
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# Lis les hôtes autorisés depuis la variable d'environnement 'ALLOWED_HOSTS'.
# Render définit l'URL de votre service web. Nous utilisons *.onrender.com pour la souplesse.
ALLOWED_HOSTS = ['192.168.1.101', '127.0.0.1', 'localhost','0.0.0.0',os.getenv("RENDER_EXTERNAL_HOSTNAME")]


# ----------------------------------------------------
# 2. APPLICATIONS
# ----------------------------------------------------
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

# ----------------------------------------------------
# 3. MIDDLEWARE
# ----------------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware", # <-- IMPORTANT: Ajout pour gérer les statics en production
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # CORS (avant CommonMiddleware)
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "TerrabiaApp.urls"

# ----------------------------------------------------
# 4. TEMPLATES, WSGI
# ----------------------------------------------------
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

# ----------------------------------------------------
# 5. BASE DE DONNÉES (POSTGRESQL POUR RENDER)
# ----------------------------------------------------
# Utilise la variable d'environnement DATABASE_URL fournie par Render
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL')
    )
}

# ----------------------------------------------------
# 6. AUTHENTIFICATION
# ----------------------------------------------------
AUTH_USER_MODEL = "api.User"

# ... (Auth & Password Validation - Rien à changer ici) ...

# ----------------------------------------------------
# 7. INTERNATIONALISATION
# ----------------------------------------------------
LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Africa/Douala"
USE_I18N = True
USE_TZ = True

# ----------------------------------------------------
# 8. STATICS & MEDIA (IMPORTANT POUR RENDER)
# ----------------------------------------------------
# URL des fichiers statiques
STATIC_URL = "/static/"
# Chemin de collection des fichiers statiques par Django (obligatoire pour WhiteNoise)
STATIC_ROOT = BASE_DIR / "staticfiles" 

# Configuration des fichiers médias (images uploadées)
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ----------------------------------------------------
# 9. DJANGO REST FRAMEWORK & CORS
# ----------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

# Pour le développement et le backend sans frontend connu (attention à la sécurité en prod !)
CORS_ALLOW_ALL_ORIGINS = True 

# ----------------------------------------------------
# 10. DEFAULT CONFIG
# ----------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ... (Le reste de votre fichier, s'il y en a) ...