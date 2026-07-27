# Stage 1: Build production static distribution
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies based on lockfile
COPY package*.json ./
RUN npm ci

# Copy project files and build
COPY . .
RUN npm run build

# Stage 2: Production Nginx Server for Cloud Run Gen2
FROM nginx:alpine

# Default PORT environment variable for Cloud Run (fallback: 8080)
ENV PORT=8080

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080

# Substitute $PORT into Nginx config at container startup and launch Nginx
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
