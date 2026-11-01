# SocialHub VPS Deployment Guide

## 1. Overview

SocialHub is designed for direct host deployment on Linux VPS systems using Docker Compose. The application integrates seamlessly with existing host-level infrastructure (Nginx + Certbot) without container port collisions or internal redundant proxies.

---

## 2. Port Configuration & VPS Isolation

SocialHub binds only to **127.0.0.1** loopback interfaces on dedicated ports reserved in the `9876–9964` range:

- **Web Frontend:** `127.0.0.1:9900`
- **REST API:** `127.0.0.1:9901`
- **Internal Database:** PostgreSQL and Redis run on private container networks and are **not exposed** on the host in production.

> [!IMPORTANT]
> Never run `docker system prune` or remove existing VPS Docker volumes and networks.

---

## 3. Host Nginx Configuration

Create an Nginx configuration file at `/etc/nginx/sites-available/socialhub.conf`:

```nginx
server {
    server_name hub.yourdomain.com;

    # Frontend Next.js Application
    location / {
        proxy_pass http://127.0.0.1:9900;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend NestJS REST API
    location /api/ {
        proxy_pass http://127.0.0.1:9901;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10M;
    }
}
```

Enable the configuration and issue SSL with Certbot:

```bash
sudo ln -s /etc/nginx/sites-available/socialhub.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d hub.yourdomain.com
```

---

## 4. Deployment Steps

```bash
# 1. Clone repository to target directory
cd /root/apps/socialhub

# 2. Configure production environment
cp .env.example .env
nano .env

# 3. Build containers
make build

# 4. Start production services
make up

# 5. Run database migrations (controlled deployment step)
make migrate

# 6. Seed platform metadata
make seed

# 7. Check logs
make logs
```

---

## 5. Backups and Restore

### Automated Backup

```bash
make backup
# Creates compressed SQL dump in ./backups/socialhub_db_YYYYMMDD_HHMMSS.sql.gz
```

### Restore Database

```bash
make restore BACKUP_FILE=./backups/socialhub_db_20261101_120000.sql.gz
```
