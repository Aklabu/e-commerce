from django.apps import AppConfig


class ContactConfig(AppConfig):
    """Configuration for the contact app"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'contact'
    verbose_name = 'Contact Messages'