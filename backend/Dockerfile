# pull official base image
FROM python:3.11-slim

# set work directory in the container
WORKDIR /code

# set environment variables
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV DJANGO_SETTINGS_MODULE=backend.settings

# install dependencies
RUN pip install --upgrade pip

# Copy the requirements file into the container
COPY requirements.txt /code/

RUN apt-get update && apt-get install -y \
  gcc \
  netcat-openbsd \
  libpq-dev \
  postgresql-client \
  && apt-get clean

# install temp dependencies for build of pyscopg2 etc
RUN pip install -r requirements.txt

# Copy the backend directory
COPY backend /code/backend
COPY manage.py /code/


# Make the entrypoint script executable
COPY entrypoint.sh /code/
RUN chmod +x /code/entrypoint.sh

# Expose the port
EXPOSE 8000

# Set the entrypoint.sh
ENTRYPOINT ["/code/entrypoint.sh"]