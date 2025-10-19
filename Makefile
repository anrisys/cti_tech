.PHONY: up down clean db-up \
	logs-nest logs-react\
	shell-db shell-backend shell-frontend

ENV ?= dev
PROJECT_NAME := cti
COMPOSE_FILE := docker-compose.$(ENV).yml

up: 
	@echo "Starting $(ENV) environment for $(PROJECT_NAME)"
	docker compose -f docker/$(COMPOSE_FILE) -p $(PROJECT_NAME) up -d

db-up: 
	@echo "Starting db for local development of project $(PROJECT_NAME)"
	docker compose -f docker/docker-compose.dev-db-only.yml -p $(PROJECT_NAME) up -d
	
down: 
	@echo "Stopping $(ENV) environment for $(PROJECT_NAME)"
	docker compose -f docker/$(COMPOSE_FILE) -p $(PROJECT_NAME) down

clean: 
	@echo "Stopping $(ENV) environment for $(PROJECT_NAME)"
	docker compose -f docker/$(COMPOSE_FILE) -p $(PROJECT_NAME) down -v

shell-db: 
	docker compose -f docker/$(COMPOSE_FILE) -p $(PROJECT_NAME) exec -it postgres bash

shell-backend: 
	docker compose -f docker/$(COMPOSE_FILE) -p $(PROJECT_NAME) exec -it backend bash

shell-frontend: 
	docker compose -f docker/$(COMPOSE_FILE) -p $(PROJECT_NAME) exec -it frontend bash

logs-nest: 
	docker compose -f docker/$(COMPOSE_FILE) -p $(PROJECT_NAME) logs backend

logs-react: 
	docker compose -f docker/$(COMPOSE_FILE) -p $(PROJECT_NAME) logs frontend