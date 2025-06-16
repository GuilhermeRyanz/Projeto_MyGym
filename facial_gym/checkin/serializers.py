# seu_app/serializers.py

from rest_framework import serializers
from .models import Student, FaceEncoding

class FaceEncodingSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo FaceEncoding.
    Atualmente não é usado diretamente nas views de login/registro,
    mas é uma boa prática tê-lo definido.
    """
    class Meta:
        model = FaceEncoding
        # Excluímos o campo 'encoding' da resposta JSON, pois é um dado binário
        # que não é útil para o cliente final.
        fields = ['id', 'student']


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Student.
    Incluímos um campo extra para contar quantos encodings estão associados.
    """
    # Adicionamos um campo que não existe diretamente no modelo.
    # Ele será preenchido pelo método 'get_encodings_count'.
    encodings_count = serializers.SerializerMethodField()

    class Meta:
        model = Student
        # Incluímos o 'id' (implícito) e 'name' do modelo, e nosso novo campo.
        fields = ['id', 'name', 'encodings_count']

    def get_encodings_count(self, obj):
        """
        Este método é chamado pelo SerializerMethodField 'encodings_count'.
        Ele recebe o objeto 'student' (obj) e retorna a contagem
        de encodings relacionados a ele.
        """
        # obj.encodings.count() é uma query eficiente graças ao 'related_name'
        # que definimos no modelo FaceEncoding.
        return obj.encodings.count()