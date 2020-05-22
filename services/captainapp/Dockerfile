FROM node:latest

WORKDIR /app

COPY . .

RUN npm install --silent

RUN npm run build

WORKDIR /app/build

RUN npm i -g serve

EXPOSE 3000

CMD [ "serve", "-p", "3000", "-s", "." ]