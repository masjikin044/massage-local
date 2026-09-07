FROM node:22-alpine

WORKDIR /app

# Menyalin package.json dan node_modules dari host
COPY package*.json ./
COPY node_modules ./node_modules
COPY server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
