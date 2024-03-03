
all:
	@make format
	@make lint

format:
	@echo "Formatting code with black"
	@venv/bin/black --line-length 100 .

lint:
	@echo "Linting code with pylint"
	@venv/bin/pylint backend

.PHONY: all format lint
