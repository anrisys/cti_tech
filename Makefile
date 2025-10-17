.PHONY: up down clean shell-db

ENV ?= dev
PROJECT_NAME := cti
COMPOSE_FILE := docker-compose.$(ENV).yml

up: 
	@echo "Starting $(ENV) environment for $(PROJECT_NAME)"
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up -d

down: 
	@echo "Stopping $(ENV) environment for $(PROJECT_NAME)"
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down

clean: 
	@echo "Stopping $(ENV) environment for $(PROJECT_NAME)"
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down -v

shell-db: 
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) exec -it postgres bash