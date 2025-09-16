FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY build.js ./
RUN npm install
RUN npm ci
COPY src ./src

# Build with the API_BASE_URL environment variable if provided
ARG API_BASE_URL
ENV API_BASE_URL=${API_BASE_URL}
RUN npm run build

FROM nginx:1.29-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/ ./
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80
