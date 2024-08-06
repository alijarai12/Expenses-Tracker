# pull official base image
FROM python:3.11-slim-bullseye

# set work directory in the container
WORKDIR /srv/app

# set environment variables
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# install dependencies
RUN pip install --upgrade pip

# Copy the requirements file into the container
COPY ./requirements.txt .

RUN apt-get update && apt-get install -y \
  gcc \
  netcat \
  libpq-dev \
  postgresql-client \
  && apt-get clean

# install temp dependencies for build of pyscopg2 etc
RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY ./entrypoint.sh .

# copy project
COPY . .
# COPY . /srv/app/

# run entrypoint.sh
ENTRYPOINT ["/srv/app/entrypoint.sh"]