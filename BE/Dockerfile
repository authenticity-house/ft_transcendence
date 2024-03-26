FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY ./requirements.txt /code/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /code/

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]
