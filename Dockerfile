# Use official Nginx image as base
FROM nginx:alpine

# Set a label and version tag (optional)
LABEL maintainer="yourname@example.com"
LABEL version="1.0"

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy your static site (HTML, CSS, JS) to Nginx web directory
COPY . /usr/share/nginx/html

# Expose port 8080 instead of 80
EXPOSE 8080

# Override default command to run nginx on port 8080
CMD ["nginx", "-g", "daemon off;"]
