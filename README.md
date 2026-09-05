# === LOCAL MASSAGE ===


### ** SEBELUM ITU RUBAH DOCKERFILE JIKA MAU DI DELPLOY LEWAT DOCKER YANG DI INSTALL DIDEBIAN
`nano backend/Dockerfile`
```
FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm config set registry https://registry.npmmirror.com && npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```
### ** SAMA DOCKER COMPOSE JUGA HARUS DI RUBAH KALAU PAKAI DEBIAN
`nano docker-compose.yml`
### UBAH FILE DI BAWAH INI
```
services:
  # 1. Database
  db:
    image: postgres:15-alpine
    container_name: app_db
    restart: always
    environment:
      POSTGRES_USER: devops_user
      POSTGRES_PASSWORD: devops_password
      POSTGRES_DB: app_db
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - app-network

  # 2. Backend API
  backend:
    build:
      context: ./backend
      network: host
    container_name: app_backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      DB_HOST: db
      DB_USER: devops_user
      DB_PASSWORD: devops_password
      DB_NAME: app_db
      PORT: 5000
    depends_on:
      - db
    networks:
      - app-network

  # 3. Frontend User
  frontend-user:
    build:
      context: ./frontend-user
      network: host
    container_name: app_user
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - app-network

  # 4. Frontend Admin
  frontend-admin:
    build:
      context: ./frontend-admin
      network: host
    container_name: app_admin
    restart: always
    ports:
      - "3001:80"
    depends_on:
      - backend
    networks:
      - app-network

  # 5. Reverse Proxy (Nginx)
  nginx:
    image: nginx:alpine
    container_name: app_proxy
    restart: always
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend-user
      - frontend-admin
    networks:
      - app-network

  # --- DEVOPS MONITORING STACK ---

  # 6. Prometheus (Metrics Collector)
  prometheus:
    image: prom/prometheus:v2.45.0
    container_name: devops_prometheus
    restart: always
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
    networks:
      - app-network

  # 7. Grafana (DevOps Dashboard)
  grafana:
    image: grafana/grafana:10.0.0
    container_name: devops_grafana
    restart: always
    ports:
      - "3002:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=adminops
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  db_data:
  grafana_data:
```
### ** UNTUK MENJALAN KAN 
```
  docker compose up -d --build
```
### ** UNTUK UNTUK MENSTOP SETEALAH BERJALAN
```
 docker compose down
```
### ** UNTUK TEST SETELAH BUILD
```
docker ps
docker compose ls
```
### ** UNTUK TEST BISA LANGSAUNG KEBROWSER
```
akses port :3000 (User)
akses port :3001 (Admin)
akses port :3002 (Grafana untuk DevOps)
user : admin
password : adminops
```
### UNTUK TEST KALAU LANGSUNG LEWAT TEMINAL VScode YANG UDAH ADA CODENYA INI MELALUI
```
http://localhost:3000
http://localhost:3001
http://localhost:3002
```
### UNTUK YANG DOCKER YANG DIINSTALL LEWAT DEBIAN SESUAIKAN IP PADA DEBIAN TERSEBUT
untuk cek ip pada debian lewat terminal
`ip a`
### CONTOH UNTUK LEWAT DEBIAN
192.168.X.X:3000
192.168.X.X:3001
192.168.X.X:3002

### === UNTUK INSTALL DOCKER LEWAT LINUX DEBIAN ===
LAKUKAN UPDATE
`sudo apt update`
`sudo apt install git -y`
`sudo apt install curl -y`
INSTALL DOCKER UBUNTU
`curl -fsSL https://get.docker.com | sudo sh`
INSTALL DOCKER DEBIAN
`curl -fsSL https://get.docker.com | sh`
TEST APAKAH BERHASIL
`docker version`
`docker compose version`
TEST DOCKER
`docker run --rm hello-world`
KALAU BERHASIL MUNCUL
`Hello from Docker!`




By Akhsanul and zorcaa
