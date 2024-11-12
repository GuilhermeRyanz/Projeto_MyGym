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


    # def has_object_permission(self, request, view, obj):
    #     if view.action in ['update', 'partial_update',] and obj == request.user.usuario:
    #         return True
    #
    #     academia_id = obj.academia.id
    #     if not UsuarioAcademia.objects.filter(usuario=request.user.usuario, academia_id=academia_id).exists():
    #         raise PermissionDenied("Você não está autorizado a modificar este usuário.")
    #
    #     if obj.tipo_usuario not in [Usuario.TipoUsuario.GERENTE, Usuario.TipoUsuario.ATENDENTE]:
    #         raise PermissionDenied("Permissão negada para este tipo de usuário.")
    #
    #     return True




