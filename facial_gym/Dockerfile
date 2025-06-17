# Usa Python 3.10 como base
FROM python:3.10-slim

# Variáveis de ambiente para melhor prática no container
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instala dependências de sistema necessárias para dlib e face_recognition
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libboost-python-dev \
    && rm -rf /var/lib/apt/lists/*

# Cria diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro para usar cache
COPY requirements.txt ./

# Instala as dependências Python
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copia o restante do código do microsserviço
COPY . .

# Expõe a porta do microsserviço
EXPOSE 8001

# Define o comando padrão: roda o Django na porta 8001
CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]
