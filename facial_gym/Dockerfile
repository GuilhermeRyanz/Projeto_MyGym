# Usa Python 3.10 baseado em Debian Bullseye (mais completo que slim)
FROM python:3.10-bullseye

# Variáveis de ambiente
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instala todas as dependências necessárias para compilar dlib e face_recognition
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    gfortran \
    python3-dev \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libboost-all-dev \
    libjpeg-dev \
    zlib1g-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia o arquivo de dependências
COPY requirements.txt ./

# Instala pacotes Python (instala dlib e pybind11 antes)
RUN pip install --upgrade pip && \
    pip install pybind11==2.10.4 && \
    pip install dlib==19.22.1 && \
    pip install -r requirements.txt

# Copia o restante da aplicação
COPY . .

# Expõe a porta do serviço facial
EXPOSE 8001

# Comando padrão para rodar o serviço Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]