all:
	@make format
	@make lint
	@make type
	@make test

format:
	@echo "Formatting code with black"
	@venv/bin/black --line-length 100 .

lint:
	@echo "Linting code with pylint"
	@venv/bin/pylint game_server match websocket

type:
	@echo "Typechecking with mypy"
	@venv/bin/mypy game_server --ignore-missing-imports
	@venv/bin/mypy match --ignore-missing-imports
	@venv/bin/mypy websocket --ignore-missing-imports

test:
	@echo "Running Django unit tests"
	@venv/bin/python manage.py test

.PHONY: all format lint typecheck test
