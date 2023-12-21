FROM nginx:latest

COPY index.html /etc/nginx/html/index.html
COPY main.css /etc/nginx/html/main.css
COPY main.js /etc/nginx/html/main.js