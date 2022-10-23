FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm audit fix --dry-run
RUN npm build
COPY . .
EXPOSE 3000
CMD [ "npm","run", "start" ]