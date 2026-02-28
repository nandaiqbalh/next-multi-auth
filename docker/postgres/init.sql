-- Add SQL statements to initialize your Postgres database.
-- This file will be executed by the official Postgres image on container start
-- e.g. create extensions, set up schemas, etc.
EOF && \
cat <<'EOF' > docker/nginx/nginx.conf
worker_processes 1;
events { worker_connections 1024; }
http {
    server {
        listen 80;
        location / {
            proxy_pass http://app:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF && \
if [ ! -f .env.docker ]; then cp .env .env.docker; fi && \
cat <<'EOF' > next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

module.exports = nextConfig;
