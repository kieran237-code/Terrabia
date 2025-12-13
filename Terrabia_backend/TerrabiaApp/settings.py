import os
from pathlib import Path
from datetime import timedelta
import dj_database_url

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
ALLOWED_HOSTS = [
    '192.168.1.101', 
    '127.0.0.1', 
    'localhost',
    '0.0.0.0',
    os.getenv("RENDER_EXTERNAL_HOSTNAME", "")
]

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
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ----------------------------------------------------
# 4. REST FRAMEWORK CONFIGURATION
# ----------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DATE_INPUT_FORMATS': ['%d/%m/%Y'],
}

# ----------------------------------------------------
# 5. SIMPLE JWT CONFIGURATION
# ----------------------------------------------------
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

ROOT_URLCONF = "TerrabiaApp.urls"

# ----------------------------------------------------
# 6. TEMPLATES, WSGI
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
# 7. BASE DE DONNÉES (POSTGRESQL POUR RENDER)
# ----------------------------------------------------
DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL", "postgresql://localhost/terrabia"),
        conn_max_age=600,
        ssl_require=not DEBUG  # SSL seulement en production
    )
}

# ----------------------------------------------------
# 8. DATE INPUT FORMATS
# ----------------------------------------------------
DATE_INPUT_FORMATS = ['%Y-%m-%d', '%d/%m/%Y', '%d-%m-%Y']

# ----------------------------------------------------
# 9. AUTHENTIFICATION
# ----------------------------------------------------
AUTH_USER_MODEL = "api.User"

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# ----------------------------------------------------
# 10. INTERNATIONALISATION
# ----------------------------------------------------
LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Africa/Douala"
USE_I18N = True
USE_TZ = True

# ----------------------------------------------------
# 11. STATICS & MEDIA
# ----------------------------------------------------
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Configuration des fichiers médias (images uploadées)
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ----------------------------------------------------
# 12. CORS CONFIGURATION
# ----------------------------------------------------
# En développement, vous pouvez utiliser CORS_ALLOW_ALL_ORIGINS = True
# En production, spécifiez les origines autorisées
CORS_ALLOW_ALL_ORIGINS = TRUE  # Seulement en mode debug

if not DEBUG:
    CORS_ALLOWED_ORIGINS = [
        "https://terrabia-frontend.onrender.com",
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "http://localhost:5173",
        "http://127.0.0.1:5174",
    ]

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

# ----------------------------------------------------
# 13. DEFAULT CONFIG
# ----------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ----------------------------------------------------
# 14. SECURITY SETTINGS FOR PRODUCTION
# ----------------------------------------------------
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
