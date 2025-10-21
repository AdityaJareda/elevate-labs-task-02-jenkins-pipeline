FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

EXPOSE 8080

CMD ["node", "app.js"]
