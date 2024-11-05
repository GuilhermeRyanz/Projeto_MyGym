from datetime import datetime
from django.core.validators import RegexValidator
from django.db import models
from core.models import ModelBase


class Aluno(ModelBase):

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
        super().save(*args, **kwargs)
        if not self.matricula:
            ano_atual = datetime.now().year
            self.matricula = f"{ano_atual}-{self.id:03}"
            super().save(update_fields=['matricula'])

    def __str__(self):
        return self.nome



class AlunoAcademia(ModelBase):

    aluno = models.ForeignKey(
        Aluno,
        on_delete=models.CASCADE,
        db_column='id_aluno',
        related_name='alunos_academia'
    )
    academia = models.ForeignKey(
        'academia.Academia',
        on_delete=models.CASCADE,
        db_column='id_academia',
        related_name='alunos_academia'
    )

    class Meta:
        db_table = 'aluno_academia'

class AlunoPlano(ModelBase):

    aluno = models.ForeignKey(
        Aluno,
        on_delete=models.CASCADE,
        db_column='id_aluno',
        related_name='alunos_plano'
    )
    plano = models.ForeignKey(
        'plano.Plano',
        on_delete=models.CASCADE,
        related_name='alunos_plano',
    )
    class Meta:
        db_table = 'aluno_plano'
