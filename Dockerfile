# Build frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

COPY Frontend/package*.json ./
RUN npm install

COPY Frontend ./

RUN npm run build


# Backend stage
FROM node:20-alpine

WORKDIR /app

# Copy backend
COPY Backend/package*.json ./Backend/
WORKDIR /app/Backend

RUN npm install

COPY Backend ./

# Copy frontend build into backend
COPY --from=frontend-build /app/frontend/dist ./public

# Install serve package
RUN npm install -g serve

EXPOSE 5000

CMD ["node", "index.js"]
