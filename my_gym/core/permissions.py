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

# from django.core.exceptions import PermissionDenied
# from rest_framework.permissions import BasePermission
#
# from academia.models import UsuarioAcademia
# from usuario.models import Usuario
#
#
# from django.core.exceptions import PermissionDenied
# from rest_framework.permissions import BasePermission
# from academia.models import UsuarioAcademia
#
#
# class AcademiaPermissionMixin:
#     """
#     Mixin para verificar permissões relacionadas à associação do usuário com uma academia.
#     """
#
#     def check_academia_permission(self, academia_id):
#         """
#         Verifica se o usuário está associado à academia.
#         """
#         if not UsuarioAcademia.objects.filter(
#             usuario=self.request.user.usuario, academia__id=academia_id
#         ).exists():
#             raise PermissionDenied("Você não tem permissão para acessar dados desta academia.")
#
#     def perform_create(self, serializer):
#         academia_id = self.request.data.get("academia")
#         self.check_academia_permission(academia_id)
#         serializer.save()
#
#     def perform_update(self, serializer):
#         academia_id = self.request.data.get("academia")
#         self.check_academia_permission(academia_id)
#         serializer.save()
#
#     def get_queryset(self):
#         """
#         Filtra os dados para retornar apenas aqueles relacionados às academias do usuário.
#         """
#         academia_id = self.request.query_params.get("academia")
#         if academia_id:
#             self.check_academia_permission(academia_id)
#
#         # Filtra os objetos com base nas academias associadas ao usuário
#         academias_ids = UsuarioAcademia.objects.filter(
#             usuario=self.request.user.usuario
#         ).values_list("academia_id", flat=True)
#         return super().get_queryset().filter(academia__id__in=academias_ids)
#
#
# class UsuarioPermission(BasePermission):
#     """
#     Permissões globais para verificar associação com academias em métodos GET.
#     """
#
#     def has_permission(self, request, view):
#         # Permitir acesso apenas a usuários autenticados
#         return request.user.is_authenticated
#
#     def has_object_permission(self, request, view, obj):
#         """
#         Verifica se o usuário está associado à academia do objeto em métodos como GET, UPDATE ou DELETE.
#         """
#         academia_id = getattr(obj, "academia_id", None)
#         if not academia_id:
#             return False
#
#         # Verifica associação com a academia
#         if not UsuarioAcademia.objects.filter(
#             usuario=request.user.usuario, academia_id=academia_id
#         ).exists():
#             raise PermissionDenied("Você não está associado à academia deste objeto.")
#
#         return True




