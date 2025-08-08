#!/bin/bash

# --- Atualizar o sistema e instalar dependências ---
echo "Atualizando o sistema e instalando dependências..."
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y git openjdk-17-jdk maven nodejs npm docker.io docker-compose

# Iniciar o Docker
sudo systemctl start docker
sudo systemctl enable docker

# --- Clonar o repositório ---
echo "Clonando o repositório do projeto..."
git clone https://github.com/kmirim/todolist-repo /home/ubuntu/meu-projeto
cd /home/ubuntu/meu-projeto

# --- Configurar e iniciar o banco de dados PostgreSQL com Docker Compose ---
echo "Iniciando o banco de dados com Docker Compose..."
cd db
sudo docker-compose up -d

# --- Configurar e iniciar a aplicação backend (Java Spring Boot) ---
echo "Iniciando a aplicação backend..."
cd ../todolist-service # Ajuste o caminho se necessário
mvn clean install
nohup java -jar target/todolist-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &

# --- Configurar e iniciar a aplicação frontend (Next.js) ---
echo "Iniciando a aplicação frontend..."
cd ../todolist 
npm install
npm run build
nohup npm start > frontend.log 2>&1 &

echo "Instalação e inicialização concluídas!"
