import chat_gym.chat
from academia.models import UsuarioAcademia
from chat_gym.models import Questions
from usuario.models import Usuario


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
        user = self.request.user

        if self.validate_gestor(user, academia):
            ia = chat_gym.chat.IaGestor(academia_id=academia, user_question=quest, user_id=user.id)
            rs = ia.run()

            Questions.objects.create(
                question=quest,
                answer=rs["answer"],
                usuario=user
            )

            return rs

        else:
            return "Você não tem permissão para acessar essa informação."

    def ask_persona(self):
        quest = self.data.get('quest')
        member = self.request.user
        aluno_id = self.request.user.aluno

        ia = chat_gym.chat.IaPersona(user_question=quest, member_id=member, aluno_id=aluno_id)
        rs = ia.run()

        aluno = Usuario.objects.filter(id=member.id).first()

        Questions.objects.create(
            question=quest,
            answer=rs,
            usuario=aluno
        )

        return rs
