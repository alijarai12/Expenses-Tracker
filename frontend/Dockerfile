# pull official base image
FROM node:16-alpine

# set work directory
WORKDIR /code

# copy package.json and package-lock.json to /code
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the project files to /code
COPY . .

# change ownership of the work directory
RUN chown -R node:node /code

# switch to a non-root user
USER node

# build the frontend (optional if you have a build step)
# RUN npm run build

# expose port if needed
EXPOSE 3000

# start the application
CMD ["npm", "start"]