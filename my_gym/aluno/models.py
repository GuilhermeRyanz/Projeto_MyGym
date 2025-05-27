from datetime import datetime

from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.db import models
from core.models import ModelBase
from usuario.models import Usuario


class Aluno(ModelBase):

    user = models.OneToOneField(Usuario, on_delete=models.CASCADE, null=True, blank=True, related_name='aluno')

    nome = models.CharField(
        db_column='nome',
        max_length=100,
        null=False,
    )

    telefone = models.CharField(
        db_column='telefone',
        max_length=100,
        validators=[RegexValidator(r'^[0-9]*$')]
    )

    email = models.EmailField(
        db_column='email',
        unique=True
    )

    data_nascimento = models.DateField(
        db_column='data_nascimento',
        auto_now_add=False,
        auto_now=False,
        default=datetime.now
    )
    matricula = models.CharField(
        db_column='matricula',
        max_length=20,
        unique=True,
        blank= True,
        validators=[RegexValidator(r'^[0-9]*$')]
    )

    class Meta:
        db_table = 'aluno'

    def save(self, *args, **kwargs):
        if Usuario.objects.get(username=self.email):
            return
        super().save(*args, **kwargs)
        if not self.matricula:
            ano_atual = datetime.now().year
            self.matricula = f"{ano_atual}-{self.id:03}"
            usuario = Usuario.objects.create_user(
                username=self.email,
                password=make_password(self.matricula),
                email=self.email,
                nome=self.nome,
                tipo_usuario="M",
            )
            self.user_id = usuario.id
            super().save(update_fields=['matricula','user_id'])

    def __str__(self):
        return self.nome


class AlunoPlano(ModelBase):
    aluno = models.ForeignKey(
        Aluno,
        on_delete=models.CASCADE,
        db_column='aluno',
        related_name='alunos_plano'
    )
    plano = models.ForeignKey(
        'plano.Plano',
        db_column='plano',
        on_delete=models.CASCADE,
        related_name='alunos_plano',
    )
    data_vencimento = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'aluno_plano'
        unique_together = ('aluno', 'plano')