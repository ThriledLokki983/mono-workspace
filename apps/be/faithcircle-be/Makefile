# app name and environment settings
# Default values can be overridden with environment variables or command line arguments
# ex) make build APP_NAME=custom-name

SHELL := /bin/bash

# Try to get APP_NAME from .envrc if it exists, otherwise use default
APP_NAME ?= $(shell grep APP_NAME .envrc 2>/dev/null | cut -d '"' -f2 2>/dev/null || echo "huishelder-api")

# Docker compose files
DEV_COMPOSE_FILE ?= docker-compose.yml
PROD_COMPOSE_FILE ?= docker-compose.prod.yml

# Port from .env file or default
PORT ?= $(shell grep PORT .env.development.local 2>/dev/null | cut -d '=' -f2 2>/dev/null || echo "5555")

# Detect whether to use `docker compose` or `docker-compose`
DOCKER_COMPOSE := $(shell if command -v docker-compose >/dev/null 2>&1; then echo "docker-compose"; else echo "docker compose"; fi)

.PHONY: help start clean db test logs dev prod

help:
	@grep -E '^[1-9a-zA-Z_-]+:.*?## .*$$|(^#--)' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m %-43s\033[0m %s\n", $$1, $$2}' \
	| sed -e 's/\[32m #-- /[33m/'

#-- Development Environment
dev: ## Start development environment (interactive mode)
	@echo "Starting development environment..."
	${DOCKER_COMPOSE} -f ${DEV_COMPOSE_FILE} up

dev-d: ## Start development environment (detached mode)
	@echo "Starting development environment in detached mode..."
	${DOCKER_COMPOSE} -f ${DEV_COMPOSE_FILE} up -d

dev-build: ## Build and start development environment
	${DOCKER_COMPOSE} -f ${DEV_COMPOSE_FILE} up --build

dev-down: ## Stop development environment
	${DOCKER_COMPOSE} -f ${DEV_COMPOSE_FILE} down

#-- Production Environment
prod: ## Start production environment (interactive mode)
	@echo "Starting production environment..."
	${DOCKER_COMPOSE} -f ${PROD_COMPOSE_FILE} up

prod-d: ## Start production environment (detached mode)
	@echo "Starting production environment in detached mode..."
	${DOCKER_COMPOSE} -f ${PROD_COMPOSE_FILE} up -d

prod-build: ## Build and start production environment
	${DOCKER_COMPOSE} -f ${PROD_COMPOSE_FILE} up --build

prod-down: ## Stop production environment
	${DOCKER_COMPOSE} -f ${PROD_COMPOSE_FILE} down

#-- Docker Management
build-dev: ## Build the development container image only
	@echo "Building development image: ${APP_NAME}-dev"
	docker build -t ${APP_NAME}-dev -f Dockerfile.dev .

build-prod: ## Build the production container image only
	@echo "Building production image: ${APP_NAME}"
	docker build -t ${APP_NAME} -f Dockerfile.prod .

run-dev: ## Run the development container image standalone
	@echo "Running development image on port ${PORT}"
	docker run -d -it -p ${PORT}:${PORT} -e PORT=${PORT} --name ${APP_NAME}-dev-container ${APP_NAME}-dev

run-prod: ## Run the production container image standalone
	@echo "Running production image on port ${PORT}"
	docker run -d -it -p ${PORT}:${PORT} -e PORT=${PORT} --name ${APP_NAME}-container ${APP_NAME}

pause: ## Pause the containers
	docker container rm -f $(shell docker ps -aq)

clean: ## Clean the images
	docker rmi -f $(shell docker images -a -q)

remove: ## Remove the volumes
	docker volume rm -f $(shell docker volume ls -q)

#-- Logs
logs: ## View logs for all services
	${DOCKER_COMPOSE} -f ${DEV_COMPOSE_FILE} logs -f

logs-server: ## View logs for server service only
	${DOCKER_COMPOSE} -f ${DEV_COMPOSE_FILE} logs -f server

logs-prod: ## View logs for production services
	${DOCKER_COMPOSE} -f ${PROD_COMPOSE_FILE} logs -f

logs-prod-server: ## View logs for production server service only
	${DOCKER_COMPOSE} -f ${PROD_COMPOSE_FILE} logs -f server-prod

#-- Database
db: ## Start the local database (development)
	${DOCKER_COMPOSE} -f ${DEV_COMPOSE_FILE} up -d pg

db-prod: ## Start the production database
	${DOCKER_COMPOSE} -f ${PROD_COMPOSE_FILE} up -d pg-prod

#-- Utilities
ps: ## List running containers
	${DOCKER_COMPOSE} -f ${DEV_COMPOSE_FILE} ps

ps-prod: ## List running production containers
	${DOCKER_COMPOSE} -f ${PROD_COMPOSE_FILE} ps

restart: ## Restart all services (development)
	${DOCKER_COMPOSE} -f ${DEV_COMPOSE_FILE} restart

restart-prod: ## Restart all services (production)
	${DOCKER_COMPOSE} -f ${PROD_COMPOSE_FILE} restart
