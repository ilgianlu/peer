FROM nginx:latest

COPY index.html /etc/nginx/html
COPY main.css /etc/nginx/html
COPY main.js /etc/nginx/html