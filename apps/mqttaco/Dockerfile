FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install -D

COPY . .

RUN npx tsc

CMD ["npm", "run", "start"]