from django.db import models
from core.models import ModelBase
from dateutil.relativedelta import relativedelta

class Pagamento(ModelBase):
    id_academia = models.ForeignKey('academia.Academia', db_column='id_academia', on_delete=models.CASCADE)
    id_aluno = models.ForeignKey('aluno.Aluno', db_column='id_aluno', on_delete=models.CASCADE)
    id_plano = models.ForeignKey('plano.Plano', db_column='id_plano', on_delete=models.CASCADE)
    data_pagamento = models.DateField(db_column='data_pagamento',
                                      auto_now_add=True)
    data_vencimento = models.DateField(db_column='data_vencimento')
    valor = models.DecimalField(db_column='valor', max_digits=8, decimal_places=2)

    def save(self, *args, **kwargs):
        self.data_vencimento = self.data_pagamento + relativedelta(months=self.id_plano.duracao)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Pagamento de {self.id_aluno.nome}, no plano {self.id_plano.nome}"

