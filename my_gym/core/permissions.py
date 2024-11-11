from django.core.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission

from academia.models import UsuarioAcademia
from usuario.models import Usuario


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



class UsuarioPermission(BasePermission):


    def has_permission(self, request, view):

        if view.action == 'create':
            return True
        return request.user.is_authenticated



