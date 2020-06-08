FROM node:latest

WORKDIR /app

COPY . .

RUN npm install --silent

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "server" ]
