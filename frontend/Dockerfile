# Stage 1: Build the Angular app
FROM node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the compiled Angular app with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy Angular build output
COPY --from=build /usr/src/app/dist/frontend/browser /usr/share/nginx/html

# Copy custom Nginx configuration and entrypoint script
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /usr/bin/docker-entrypoint.sh
RUN chmod +x /usr/bin/docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Use the custom entrypoint script
ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
