from django.core.exceptions import PermissionDenied
from academia.models import UsuarioAcademia

class AcademiaPermissionMixin:
    def check_permission(self, academia):

        if not UsuarioAcademia.objects.filter(usuario=self.request.user.usuario, academia__id=academia).exists():
            raise PermissionDenied("Você não está associado a essa academia.")

    def perform_create(self, serializer):
        academia_id = self.request.data.get('academia')
        self.check_permission(academia_id)
        serializer.save()

    def perform_update(self, serializer):
        academia_id = self.request.data.get('academia')
        self.check_permission(academia_id)
        serializer.save()
