from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from aluno.models import AlunoPlano


@receiver(pre_save, sender=AlunoPlano)
def update_total_members_in_update(sender, instance, **kwargs):
    if not instance.pk:
        return

    instanccia_antiga = AlunoPlano.objects.get(pk=instance.pk)

    if instanccia_antiga.active != instance.active:
        plano = instance.plano
        if instance.active:
            plano.total_alunos += 1
        else:
            plano.total_alunos = max(plano.total_alunos - 1, 0)
        plano.save()


@receiver(post_save, sender=AlunoPlano)
def update_total_members_in_creation(sender, instance, created, **kwargs):
    if created and instance.active:
        plano = instance.plano
        plano.total_alunos += 1
        plano.save()
