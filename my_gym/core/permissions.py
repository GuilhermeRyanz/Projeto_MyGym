from django.core.exceptions import PermissionDenied
from academia.models import UsuarioAcademia

class AcademiaPermissionMixin:
    def check_permission(self, academia_id):

        if not UsuarioAcademia.objects.filter(usuario=self.request.user.usuario, academia__id=academia_id).exists():
            raise PermissionDenied("Você não está associado a essa academia.")

    def perform_create(self, serializer):
        academia_id = self.request.data.get('academia')  # Ajuste: usar o campo correto
        self.check_permission(academia_id)  # Verificação da permissão
        serializer.save()

    def perform_update(self, serializer):
        academia_id = self.request.data.get('academia')  # Ajuste: usar o campo correto
        self.check_permission(academia_id)  # Verificação da permissão
        serializer.save()
