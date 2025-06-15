from academia.models import Exercise
from unidecode import unidecode
from django.db.models import Q

def get_exercise(title: str = "", muscle_group: str = "", equipment: str = ""):
    query = Exercise.objects.filter(active=True, status="aprovado")

    if title:
        normalized_title = unidecode(title)
        query = query.filter(
            Q(title__icontains=title) | Q(title__icontains=normalized_title)
        )
    if muscle_group:
        normalized_muscle_group = unidecode(muscle_group)
        query = query.filter(
            Q(muscle_group__icontains=muscle_group) | Q(muscle_group__icontains=normalized_muscle_group)
        )
    if equipment:
        normalized_equipment = unidecode(equipment)
        query = query.filter(
            Q(equipment__icontains=equipment) | Q(equipment__icontains=normalized_equipment)
        )

    data = query.values("title", "muscle_group", "equipment", "description", "type", "level")
    return list(data)



