# Stage 1: Build Stage
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy dependency files first for better layer caching
COPY package.json bun.lock ./

# Install dependencies (including devDependencies needed for tsc and vite build)
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the application
# This runs "tsc -b && vite build" as defined in package.json
RUN bun run build

# Stage 2: Production Stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from the builder stage
COPY --from=builder /app/dist .

# Copy custom nginx config to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
