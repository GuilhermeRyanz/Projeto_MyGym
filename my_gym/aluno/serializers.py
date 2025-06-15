from datetime import date

from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers

from aluno import models
from aluno.models import Aluno, WorkoutExercise, WorkoutDay, WorkOutPlan
from plano import models as plano_models
from plano.serializers import PlanoSerializer


class AlunoSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(read_only=True)
    matricula = serializers.CharField(read_only=True)
    nome = serializers.CharField(max_length=100)
    email = serializers.EmailField(allow_blank=False)
    telefone = serializers.CharField(max_length=100, allow_blank=True)
    data_nascimento = serializers.DateField(allow_null=True)

    class Meta:
        model = models.Aluno
        fields = ['active', 'id', 'nome', 'email', 'telefone', 'matricula', "data_nascimento"]

    def validate_data_nascimento(self, value):
        if value and value > date.today():
            raise serializers.ValidationError("A data de nascimento não pode ser no futuro.")
        return value

    def update(self, instance, validated_data):
        email = validated_data.get('email')

        if email and instance.email != email:
            if Aluno.objects.filter(email=email).exclude(id=instance.id).exists():
                raise serializers.ValidationError(
                    {"email": "Já existe um aluno cadastrado com esse email"}
                )

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.user.username  = instance.email
        instance.user.email = instance.email
        instance.user.save()
        instance.email = instance.user.email

        instance.save()
        return instance


class AlunoPlanoSerializer(FlexFieldsModelSerializer):
    plano = serializers.PrimaryKeyRelatedField(
        queryset=plano_models.Plano.objects.all(),
        required=True
    )

    class Meta:
        model = models.AlunoPlano
        fields = ['id', 'aluno', 'active', 'created_at', 'plano', 'data_vencimento']
        expandable_fields = {'aluno': AlunoSerializer, 'plano': PlanoSerializer}

    def create(self, validated_data):
        models.AlunoPlano.objects.filter(
            aluno_id=validated_data['aluno'],
            plano__academia=validated_data['plano'].academia,
            active=True
        ).update(active=False)
        return super().create(validated_data)


class WorkoutExerciseSerializer(FlexFieldsModelSerializer):
    exercise_name = serializers.ReadOnlyField(source='exercise.title')

    class Meta:
        model = WorkoutExercise
        fields = ['id', 'exercise', 'exercise_name', 'sets', 'repetitions', 'observations']

class WorkoutDaySerializer(FlexFieldsModelSerializer):
    exercises = WorkoutExerciseSerializer(many=True, required=False)
    day = serializers.SerializerMethodField()

    class Meta:
        model = WorkoutDay
        fields = ['id', 'workout_plan', 'days_of_week', 'day', 'exercises']

    def get_day(self, obj):
        day_mapping = {
            'segunda': 0,
            'terca': 1,
            'quarta': 2,
            'quinta': 3,
            'sexta': 4,
            'sabado': 5,
            'domingo': 6
        }
        return day_mapping.get(obj.days_of_week, -1)

    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises', [])
        workout_day = WorkoutDay.objects.create(**validated_data)
        for ex_data in exercises_data:
            WorkoutExercise.objects.create(workout_day=workout_day, **ex_data)
        return workout_day

    def update(self, instance, validated_data):
        exercises_data = validated_data.pop('exercises', [])
        instance.workout_plan = validated_data.get('workout_plan', instance.workout_plan)
        instance.days_of_week = validated_data.get('days_of_week', instance.days_of_week)
        instance.save()

        instance.exercises.all().delete()

        for ex_data in exercises_data:
            WorkoutExercise.objects.create(workout_day=instance, **ex_data)

        return instance

class WorkoutPlanSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = WorkOutPlan
        fields = '__all__'