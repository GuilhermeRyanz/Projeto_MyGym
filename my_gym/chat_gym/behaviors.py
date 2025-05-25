import chat_gym.chat
from academia.models import UsuarioAcademia

class ChatBehavior:
    def __init__(self, resquest):
        self.data = resquest.data
        self.request = resquest

    def validate_gestor(self, user, academia):
        relation = UsuarioAcademia.objects.filter(
            usuario=user,
            academia=academia,
            active=True
        ).exists()
        return relation


    def ask_gestor(self):
        quest = self.data.get('quest')
        academia = self.data.get('academia')
        user = self.request.user.usuario

        if self.validate_gestor(user, academia):
            ia = chat_gym.chat.IaGestor(academia_id=academia, user_question=quest)
            return ia.run()
        else:
            return "Você não tem permissão para acessar essa informação."

    def ask_persona(self):
        quest = self.data.get('quest')
        academia = self.data.get('academia')
        member = self.data.get('member')

        ia = chat_gym.chat.IaPersona(academia_id=academia, user_question=quest, member_id=member)
        return ia.run()