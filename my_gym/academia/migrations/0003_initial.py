# Generated by Django 5.1.2 on 2024-11-07 15:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('academia', '0002_initial'),
        ('usuario', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuarioacademia',
            name='usuario',
            field=models.ForeignKey(db_column='usuario', on_delete=django.db.models.deletion.CASCADE, to='usuario.usuario'),
        ),
    ]
