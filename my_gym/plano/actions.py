from rest_framework.response import Response

from plano import models


class PlanoActions:

    @staticmethod
    def disable_plan(request, plan):

        if request.user.tipo_usuario == "A":
            return Response({'erro': 'Seu cargo não tem permissão para desativar planos.'}, status=403)

        if request.user.tipo_usuario == "A":
            return Response({'erro': 'Seu cargo não tem permissão para desativar planos.'}, status=403)

        try:
            plan.active = False
            plan.save()
            return Response({'status': 'plano desativado com sucesso'}, status=200)
        except models.Plano.DoesNotExist:
            return Response({'erro': 'Plano não encontrado'}, status=404)
        except Exception as e:
            return Response({'erro': str(e)}, status=500)
