import json

import boto3
import uuid
from django.conf import settings
from rest_framework import serializers

s3 = boto3.client(
    's3',
    endpoint_url=settings.MINIO_ENDPOINT,
    aws_access_key_id=settings.MINIO_ACCESS_KEY,
    aws_secret_access_key=settings.MINIO_SECRET_KEY,
)


def upload_data_to_minio(file_obj, nome_original, bucket=None):
    bucket = bucket or settings.MINIO_BUCKET
    extension = nome_original.split('.')[-1].lower()
    name_archive = f"media/{uuid.uuid4()}.{extension}"

    extension_allow = ['jpg', 'jpeg', 'png']
    if extension not in extension_allow:
        raise serializers.ValidationError(
            f"Extension '{extension}' is not allowed, only {extension_allow}"
        )


    try:
        s3.upload_fileobj(
            file_obj,
            bucket,
            name_archive,
            ExtraArgs={"ContentType": file_obj.content_type}
        )
    except Exception as e:
        raise serializers.ValidationError(f"Error create bucket file: {str(e)}")

    return f"{settings.MINIO_ENDPOINT}/{bucket}/{name_archive}"

def delete_data_from_minio(file_url_or_key):
    try:
        prefix = f"{settings.MINIO_ENDPOINT}/{settings.MINIO_BUCKET}/"
        if file_url_or_key.startswith(prefix):
            key = file_url_or_key.replace(prefix, "")
        else:
            key = file_url_or_key

        s3.delete_object(
            Bucket=settings.MINIO_BUCKET,
            Key=key
        )

    except Exception as e:
        raise serializers.ValidationError(f"Error deleting file: {str(e)}")
