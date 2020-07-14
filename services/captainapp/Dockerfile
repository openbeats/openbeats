FROM node:latest

WORKDIR /app

COPY . .

RUN npm install --silent

RUN npm run build

WORKDIR /app/build

RUN npm i -g serve

EXPOSE 8000

CMD [ "serve", "-p", "8000", "-s", "." ]
