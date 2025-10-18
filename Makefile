.PHONY: up down clean shell-db db-up \
	logs-nest

ENV ?= dev
PROJECT_NAME := cti
COMPOSE_FILE := docker-compose.$(ENV).yml

up: 
	@echo "Starting $(ENV) environment for $(PROJECT_NAME)"
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up -d

db-up: 
	@echo "Starting db for local development of project $(PROJECT_NAME)"
	docker compose -f docker/docker-compose.dev-db-only.yml -p $(PROJECT_NAME) up -d

down: 
	@echo "Stopping $(ENV) environment for $(PROJECT_NAME)"
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down

clean: 
	@echo "Stopping $(ENV) environment for $(PROJECT_NAME)"
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down -v

shell-db: 
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) exec -it postgres bash

logs-nest: 
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) logs backend