# --- Construction du site (Vite) ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Les appels API passent par le même domaine (/api), relayés par Nginx
ENV VITE_API_URL=/api
RUN npm run build

# --- Service web ---
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
