# views.py — VERSÃO ATUALIZADA COM KNN
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from django.conf import settings

import face_recognition
import pandas as pd
import boto3
import io
import logging

from sklearn.neighbors import KNeighborsClassifier
import numpy as np

logger = logging.getLogger(__name__)


class FacialDataUploadView(APIView):
    """
    Recebe imagens faciais e um ID de aluno, gera um arquivo Parquet com
    os encodings e o salva no MinIO.
    """
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        student_id = request.data.get('student_id')
        gym_id = request.data.get('gym_id')
        image_files = request.FILES.getlist('face_images')

        if not student_id or not gym_id or not image_files:
            return Response(
                {'error': 'O ID do aluno, o ID da academia e as imagens faciais são obrigatórios.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        face_encodings = []
        for image_file in image_files:
            try:
                img = face_recognition.load_image_file(image_file)
                # Usa jittering para encodings mais robustos
                encodings = face_recognition.face_encodings(img, num_jitters=5)
                if encodings:
                    face_encodings.extend(encodings)
            except Exception as e:
                logger.warning(f"Não foi possível processar uma imagem para o aluno {student_id}: {e}")
                continue

        if not face_encodings:
            return Response(
                {'error': 'Nenhum rosto foi detectado nas imagens fornecidas.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Salva todos os encodings como linhas de um DataFrame
        df = pd.DataFrame(face_encodings)

        # Escreve em Parquet
        parquet_buffer = io.BytesIO()
        df.to_parquet(parquet_buffer, index=False)
        parquet_buffer.seek(0)

        # Upload no MinIO
        try:
            s3_client = boto3.client(
                's3',
                endpoint_url=settings.MINIO_STORAGE_ENDPOINT,
                aws_access_key_id=settings.MINIO_STORAGE_ACCESS_KEY,
                aws_secret_access_key=settings.MINIO_STORAGE_SECRET_KEY,
            )

            object_name = f"academias/{gym_id}/alunos/{student_id}/encodings.parquet"

            s3_client.put_object(
                Bucket=settings.MINIO_STORAGE_BUCKET_NAME,
                Key=object_name,
                Body=parquet_buffer,
                ContentType='application/octet-stream'
            )

            logger.info(f"Encodings salvos para aluno {student_id} na academia {gym_id} em {object_name}")

            return Response(
                {'success': 'Dados faciais registrados com sucesso no MinIO.'},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            logger.error(f"Erro ao salvar no MinIO: {e}")
            return Response(
                {'error': 'Falha ao salvar os dados faciais.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FacialRecognitionView(APIView):
    """
    Recebe uma imagem facial, compara usando KNN com todos os encodings
    dos alunos da academia e retorna o aluno mais próximo, desde que
    a confiança seja maior que o limiar definido.
    """
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        gym_id = request.data.get('gym_id')
        image_file = request.FILES.get('face_image')

        if not gym_id or not image_file:
            return Response(
                {'error': 'O ID da academia e a imagem facial são obrigatórios.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Faz encoding da imagem recebida
            img = face_recognition.load_image_file(image_file)
            encodings = face_recognition.face_encodings(img)
            if not encodings:
                return Response(
                    {'error': 'Nenhum rosto foi detectado na imagem enviada.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            input_encoding = encodings[0]

            # Conecta no MinIO
            s3_client = boto3.client(
                's3',
                endpoint_url=settings.MINIO_STORAGE_ENDPOINT,
                aws_access_key_id=settings.MINIO_STORAGE_ACCESS_KEY,
                aws_secret_access_key=settings.MINIO_STORAGE_SECRET_KEY,
            )

            bucket_name = settings.MINIO_STORAGE_BUCKET_NAME
            prefix = f"academias/{gym_id}/alunos/"
            response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

            X_train = []
            y_train = []

            for obj in response.get('Contents', []):
                key = obj['Key']
                if key.endswith('encodings.parquet'):
                    parts = key.split('/')
                    student_id = parts[3]

                    parquet_obj = s3_client.get_object(Bucket=bucket_name, Key=key)
                    parquet_data = parquet_obj['Body'].read()
                    df = pd.read_parquet(io.BytesIO(parquet_data))

                    for idx, row in df.iterrows():
                        X_train.append(row.to_numpy())
                        y_train.append(student_id)

            if not X_train:
                return Response(
                    {'error': 'Nenhum encoding encontrado para esta academia.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Converte para arrays numpy
            X_train = np.array(X_train)
            y_train = np.array(y_train)

            # Treina o KNN
            knn = KNeighborsClassifier(n_neighbors=3, weights='distance')
            knn.fit(X_train, y_train)

            # Predição
            predicted_id = knn.predict([input_encoding])[0]
            distances, indices = knn.kneighbors([input_encoding], n_neighbors=3)
            best_distance = distances[0][0]

            logger.info(f"KNN predicted: {predicted_id} com distância {best_distance}")

            # Verifica distância (threshold ~ 0.45–0.6 é comum)
            if best_distance < 0.45:
                return Response(
                    {'student_id': predicted_id, 'distance': float(best_distance)},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Nenhum rosto correspondeu com confiança suficiente.'},
                    status=status.HTTP_404_NOT_FOUND
                )

        except Exception as e:
            logger.error(f"Erro no reconhecimento facial: {e}")
            return Response(
                {'error': 'Falha ao realizar reconhecimento facial.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
