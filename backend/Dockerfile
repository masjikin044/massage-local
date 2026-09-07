FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Menambahkan konfigurasi timeout agar npm install di Debian tidak gagal/stuck
RUN npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm install --network-timeout=100000

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]