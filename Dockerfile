# Stage 1: Build static assets
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies based on lockfile
COPY package*.json ./
RUN npm ci

# Copy project files and build
COPY . .
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
