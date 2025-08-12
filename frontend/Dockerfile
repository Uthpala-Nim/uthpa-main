# frontend/Dockerfile
FROM nginx:alpine
# Copy your static Lugx site into NGINX's web root
COPY . /usr/share/nginx/html
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80