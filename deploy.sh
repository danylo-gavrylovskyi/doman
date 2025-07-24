#!/bin/bash

set -euo pipefail

BACKEND_REPO_URL="https://github.com/danylo-gavrylovskyi/DomanBack"
FRONTEND_REPO_URL="https://github.com/danylo-gavrylovskyi/DomanFront"
PROJECT_DIR="doman"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
DOCKER_COMPOSE_FILE="$PROJECT_DIR/backend/docker-compose.yml"

NODE_VERSION="18.x"
DOCKER_COMPOSE_VERSION="1.29.2"

install_docker() {
    echo "Installing Docker..."
    sudo apt update
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt update
    sudo apt install -y docker-ce
}

install_docker_compose() {
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
}

install_node() {
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION} | sudo -E bash -
    sudo apt install -y nodejs
}

install_nginx() {
    echo "Installing Nginx..."
    sudo apt update
    sudo apt install -y nginx
}

install_git() {
    echo "Installing Git..."
    sudo apt update
    sudo apt install -y git
}

clone_backend_repo() {
    echo "Cloning backend repository..."
    if [ -d "$BACKEND_DIR" ]; then
        echo "Backend repository directory already exists. Pulling latest changes..."
        cd $BACKEND_DIR
        git pull origin main
    else
        git clone $BACKEND_REPO_URL $BACKEND_DIR
        echo "Moving docker-compose to root folder..."
        cd ~/$BACKEND_DIR
        mv docker-compose.yml ..
    fi
}

clone_frontend_repo() {
    echo "Cloning frontend repository..."
    if [ -d "$FRONTEND_DIR" ]; then
        echo "Frontend repository directory already exists. Pulling latest changes..."
        cd $FRONTEND_DIR
        git pull origin main
    else
        cd ~
        git clone $FRONTEND_REPO_URL $FRONTEND_DIR
    fi
}

start_docker_containers() {
    echo "Starting Docker containers..."
    cd ~
    docker-compose --env-file doman/backend/.env -f $DOCKER_COMPOSE_FILE up -d
}

install_git
install_node
install_docker
install_docker_compose
install_nginx

clone_backend_repo
clone_frontend_repo

start_docker_containers

echo "Deployment complete."
