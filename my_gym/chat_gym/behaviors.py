import chat_gym.chat
from academia.models import UsuarioAcademia
from aluno.models import Aluno
from chat_gym.models import Questions


class ChatBehavior:
    def __init__(self, resquest):
        self.data = resquest.data
        self.request = resquest

    def validate_gestor(self, user, academia):
        relation = UsuarioAcademia.objects.filter(
            usuario=user,
            active=True
        ).exists()
        return relation

    def ask_gestor(self):
        quest = self.data.get('quest')
        academia = self.data.get('academia')
        user = self.request.user.usuario

        if self.validate_gestor(user, academia):
            ia = chat_gym.chat.IaGestor(academia_id=academia, user_question=quest)
            rs = ia.run()

            Questions.objects.create(
                question=quest,
                answer=rs[0].content,
                usuario=user
            )

            return str(rs[0])

        else:
            return "Você não tem permissão para acessar essa informação."

    def ask_persona(self):
        quest = self.data.get('quest')
        member = self.request.data.get('aluno')

        ia = chat_gym.chat.IaPersona(user_question=quest, member_id=member)
        rs = ia.run()

        aluno = Aluno.objects.filter(id=member).first()

        Questions.objects.create(
            question=quest,
            answer=rs[0].content,
            aluno=aluno
        )

        return rs[0].content
