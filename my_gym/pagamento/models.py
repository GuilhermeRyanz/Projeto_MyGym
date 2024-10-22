from django.db import models
from core.models import ModelBase
from dateutil.relativedelta import relativedelta
from aluno.models import AlunoPlano

class Pagamento(ModelBase):

    data_pagamento = models.DateField(db_column='data_pagamento',
                                      auto_now_add=True)
    data_vencimento = models.DateField(db_column='data_vencimento')

    plano_aluno = models.ForeignKey(AlunoPlano, on_delete=models.CASCADE, db_column='id_plano')


    def save(self, *args, **kwargs):
        self.data_vencimento = self.data_pagamento + relativedelta(months=self.plano_aluno.id_plano.duracao)
        super().save(*args, **kwargs)


    class Meta:
        db_table = 'pagamento'

