# Multi-stage build: Vite build -> Nginx static + proxy
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package metadata and install deps
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build-time API base URLs for Vite (embedded into bundle)
# Leave empty to use relative paths and hit Nginx proxy
ARG VITE_API_BASE_URL=""
ARG VITE_BACKEND_URL=""
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Build for production (outputs to dist)
RUN npm run build

# --- Runtime stage ---
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config: SPA routing + reverse proxy to backend service
RUN echo 'server { \
    listen 80; \
    server_name _; \
    \
    # Serve the SPA
    location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri $uri/ /index.html; \
    } \
    \
    # Auth endpoints (cookies flow)
    location /auth/ { \
    proxy_pass http://backend:3000/auth/; \
    proxy_http_version 1.1; \
    proxy_set_header Upgrade $http_upgrade; \
    proxy_set_header Connection "upgrade"; \
    proxy_set_header Host $host; \
    proxy_set_header X-Real-IP $remote_addr; \
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
    proxy_set_header X-Forwarded-Proto $scheme; \
    proxy_set_header Cookie $http_cookie; \
    } \
    \
    # Deploy endpoints
    location ^~ /deploy { \
    proxy_pass http://backend:3000/deploy; \
    proxy_http_version 1.1; \
    proxy_set_header Upgrade $http_upgrade; \
    proxy_set_header Connection "upgrade"; \
    proxy_set_header Host $host; \
    proxy_set_header X-Real-IP $remote_addr; \
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
    proxy_set_header X-Forwarded-Proto $scheme; \
    proxy_set_header Cookie $http_cookie; \
    } \
    } ' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
