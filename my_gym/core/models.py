from django.db import models

# Create your models here.

class ModelBase(models.Model):

    id = models.BigAutoField(
        db_column='id',
        primary_key=True,
        null = False,
        )

    created_at = models.DateTimeField(
        db_column='dt_created',
        auto_now_add = True,
        null = True,
    )

    modified_at = models.DateTimeField(
        db_column='dt_modified',
        auto_now = True,
        null = True,
    )

    active = models.BooleanField(
        db_column='cs_active',
        null = False,
        default = True,
    )

    class Meta:
        abstract = True
        managed = True


