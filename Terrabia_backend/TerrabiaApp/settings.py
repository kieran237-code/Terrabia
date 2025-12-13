import os
from pathlib import Path
from datetime import timedelta
#import dj_database_url # Import pour gérer l'URL de la base de données PostgreSQL

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
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DATE_INPUT_FORMATS': ['%d/%m/%Y'],
}

    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
}



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
import dj_database_url

DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL"),
        conn_max_age=600,
        ssl_require=True
    )
}
# ⚠️ Il faut bien écrire ce bloc en dehors du dictionnaire REST_FRAMEWORK
from django.conf.locale.fr import formats as fr_formats
fr_formats.DATE_INPUT_FORMATS = ['%Y-%m-%d', '%d/%m/%Y', '%d-%m-%Y']

# OU ALORS plus simplement :
DATE_INPUT_FORMATS = ['%Y-%m-%d', '%d/%m/%Y', '%d-%m-%Y']

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
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Configuration des fichiers médias (images uploadées)
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# Pour le développement et le backend sans frontend connu (attention à la sécurité en prod !)
CORS_ALLOW_ALL_ORIGINS = True  # Autorise tous les domaines (en dev seulement)

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]


# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://localhost:5174",  # si ton frontend est en React
    "http://localhost:5500",  # ou ton port Flutter web
    "http://127.0.0.1:5500",
    "http://127.0.0.1:8000",  # optionnel
]


# ----------------------------------------------------
# 10. DEFAULT CONFIG
# ----------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ... (Le reste de votre fichier, s'il y en a) ...
