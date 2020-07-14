FROM node:latest

WORKDIR /app

COPY . .

RUN npm install --silent

EXPOSE 6000

CMD [ "node", "index.js" ]