# Generated by Django 5.1.2 on 2024-11-07 15:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Academia',
            fields=[
                ('id', models.BigAutoField(db_column='id', primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_column='dt_created', null=True)),
                ('modified_at', models.DateTimeField(auto_now=True, db_column='dt_modified', null=True)),
                ('active', models.BooleanField(db_column='cs_active', default=True)),
                ('nome', models.CharField(db_column='name', max_length=100)),
                ('endereco', models.CharField(db_column='endereco', max_length=200)),
                ('telefone', models.CharField(db_column='telefone', max_length=100, null=True)),
                ('email', models.EmailField(db_column='email', max_length=254, null=True)),
            ],
            options={
                'db_table': 'academia',
            },
        ),
        migrations.CreateModel(
            name='UsuarioAcademia',
            fields=[
                ('id', models.BigAutoField(db_column='id', primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_column='dt_created', null=True)),
                ('modified_at', models.DateTimeField(auto_now=True, db_column='dt_modified', null=True)),
                ('active', models.BooleanField(db_column='cs_active', default=True)),
                ('tipo_usuario', models.CharField(choices=[('D', 'Dono'), ('G', 'Gerente'), ('A', 'Atendente')], db_column='tipo_usuario', max_length=1)),
            ],
            options={
                'db_table': 'usuario_academia',
            },
        ),
        migrations.CreateModel(
            name='Frequencia',
            fields=[
                ('id', models.BigAutoField(db_column='id', primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_column='dt_created', null=True)),
                ('modified_at', models.DateTimeField(auto_now=True, db_column='dt_modified', null=True)),
                ('active', models.BooleanField(db_column='cs_active', default=True)),
                ('data', models.DateTimeField(auto_now_add=True, db_column='data')),
                ('academia', models.ForeignKey(db_column='academia', on_delete=django.db.models.deletion.CASCADE, to='academia.academia')),
            ],
            options={
                'db_table': 'frequencia',
            },
        ),
    ]
