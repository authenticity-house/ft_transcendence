
all:
	@make format
	@make lint

format:
	@echo "Formatting code with black"
	@venv/bin/black --line-length 100 .

lint:
	@echo "Linting code with pylint"
	@venv/bin/pylint game_server

.PHONY: all format lint
