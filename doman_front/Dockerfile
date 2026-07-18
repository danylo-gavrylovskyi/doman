FROM node:18-alpine

RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN chown -R node:node /app
USER node

CMD [ "npm", "run", "start" ]
