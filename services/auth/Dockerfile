  
FROM node:latest

WORKDIR /app

COPY . .

RUN npm install --silent

EXPOSE 2000

CMD [ "node", "index.js" ]