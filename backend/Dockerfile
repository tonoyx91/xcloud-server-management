# backend/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Install deps first for better caching
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy app
COPY src ./src

# Drop privileges
RUN addgroup -S nodegrp && adduser -S nodeuser -G nodegrp
USER nodeuser

EXPOSE 5000
CMD ["node", "src/app.js"]
