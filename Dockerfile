# Use an Nginx base image
FROM nginx:alpine

# Remove default index page and copy your site files
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
