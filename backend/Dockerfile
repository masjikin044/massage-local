FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev --no-audit --no-fund --legacy-peer-deps

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]