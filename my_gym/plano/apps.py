from django.apps import AppConfig


class PlanoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'plano'

    def ready(self):
        import plano.signals