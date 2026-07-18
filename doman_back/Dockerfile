FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Database migration assets (run via `npm run db:migrate`, e.g. a Railway pre-deploy command)
COPY --from=builder /app/db ./db
COPY --from=builder /app/.sequelizerc ./.sequelizerc

RUN chown -R node:node /app
USER node

CMD [ "node", "dist/src/main" ]
