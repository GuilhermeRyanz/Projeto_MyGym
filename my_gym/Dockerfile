FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

ENV DJANGO_SETTINGS_MODULE=my_gym.settings \
    PYTHONUNBUFFERED=1

EXPOSE 8080

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]