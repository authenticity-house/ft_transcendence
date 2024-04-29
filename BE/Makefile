all:
	@make format
	@make lint
	@make type
	@make test

migrate:
	venv/bin/python manage.py makemigrations
	venv/bin/python manage.py migrate

run:
	venv/bin/python manage.py runserver

format:
	@echo "Formatting code with black"
	@venv/bin/black --line-length 100 .

lint:
	@echo "Linting code with pylint"
	@venv/bin/pylint backend users stats rooms websocket

type:
	@echo "Typechecking with mypy"
	@venv/bin/mypy backend --ignore-missing-imports
	@venv/bin/mypy users --ignore-missing-imports --exclude '/migrations/'
	@venv/bin/mypy stats --ignore-missing-imports --exclude '/migrations/'

test:
	@echo "Running Django unit tests"
	@venv/bin/python manage.py test

.PHONY: all format lint typecheck test migrate run
