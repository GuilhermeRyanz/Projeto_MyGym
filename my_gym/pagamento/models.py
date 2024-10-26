from django.db import models
from core.models import ModelBase
from dateutil.relativedelta import relativedelta
from aluno.models import AlunoPlano
from django.utils import timezone

class Pagamento(ModelBase):

    data_pagamento = models.DateField(db_column='data_pagamento',
                                      auto_now_add=True)
    data_vencimento = models.DateField(db_column='data_vencimento')

    aluno_plano = models.ForeignKey(AlunoPlano, on_delete=models.CASCADE, db_column='aluno_plano')


    def save(self, *args, **kwargs):

        if not self.data_pagamento:
            self.data_pagamento = timezone.now().date()
        self.data_vencimento = self.data_pagamento + relativedelta(months=self.aluno_plano.plano.duracao)
        super().save(*args, **kwargs)


    class Meta:
        db_table = 'pagamento'





