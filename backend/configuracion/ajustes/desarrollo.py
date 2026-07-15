from .base import *
DEBUG = True
CHANNEL_LAYERS = {'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}}
ALLOWED_HOSTS = ['*']
DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': BASE_DIR / 'db.sqlite3'}}
CORS_ALLOW_ALL_ORIGINS = True
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
LOGGING = {'version': 1, 'disable_existing_loggers': False, 'handlers': {'console': {'class': 'logging.StreamHandler'}}, 'loggers': {'django': {'handlers': ['console'], 'level': 'INFO'}, 'aplicaciones': {'handlers': ['console'], 'level': 'DEBUG'}}}
STATICFILES_DIRS = [BASE_DIR / 'frontend' / 'public']
USE_L10N = True