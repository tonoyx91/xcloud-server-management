# frontend/Dockerfile

# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
RUN npm run build

# ---- serve stage ----
FROM nginx:alpine
# Nginx config with /api proxy to "backend" service
COPY nginx.conf /etc/nginx/nginx.conf
# Copy Vite build output
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
