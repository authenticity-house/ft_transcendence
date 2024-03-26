all: up

env_file:
	@if [ ! -f ./.env ]; then \
		printf "Please enter the content for .env file (end with EOF):\n"; \
		while IFS= read -r line || [ -n "$$line" ]; do \
			echo "$$line" >> ./.env; \
		done; \
	fi

up: env_file
	@docker-compose up -d

build: env_file
	@docker-compose up -d --build

down: env_file
	@docker-compose down

re: down build

logs: 
	@docker-compose logs

ps:
	@docker-compose ps

.PHONY	: all env_file up build down re logs ps