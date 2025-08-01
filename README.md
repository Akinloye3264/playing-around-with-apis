# Mood Music Finder

A modern, interactive music discovery application that helps you find the perfect music based on your current mood. Using the iTunes API, this app searches for songs that match your emotional state and provides a complete music listening experience.

## 🎵 Features

### Core Features
- **Mood-Based Search**: 8 different moods to choose from (Happy, Sad, Angry, Relaxed, Energetic, Romantic, Nostalgic, Focused)
- **iTunes API Integration**: Real music data from Apple's iTunes Store
- **Music Playback**: Built-in audio player with preview functionality
- **Song Information**: Complete track details including artist, album, and artwork
- **Playlist Management**: Add songs to your personal playlist
- **Responsive Design**: Works perfectly on all devices

### Advanced Features
- **Smart Search Algorithm**: Uses mood-specific keywords to find relevant songs
- **Audio Player Controls**: Play, pause, progress tracking, and time display
- **Sample Data Fallback**: Works offline with curated sample songs
- **Modern UI**: Glassmorphism design with smooth animations
- **Error Handling**: Graceful fallback when API is unavailable

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **API**: iTunes Search API (https://itunes.apple.com/search)
- **Audio**: HTML5 Audio API for music playback
- **Styling**: Custom CSS with modern design patterns
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)
- **Containerization**: Docker with Nginx and HAProxy Load Balancer

## 📁 Project Structure

```
playing-around-with-apis/
├── index.html          # Main HTML file
├── style.css           # CSS styles and animations
├── script.js           # JavaScript functionality
├── download.jpg        # Favicon image
├── Dockerfile          # Web server Docker configuration
├── Dockerfile.lb       # Load balancer Docker configuration
├── haproxy.cfg         # HAProxy configuration
├── nginx.conf          # Nginx configuration
├── docker-compose.yml  # Docker Compose configuration
└── README.md           # This file
```

## 🐳 Docker Setup & Deployment

### **Complete Setup Process**

This project uses a multi-container Docker setup with load balancing:

- **Web Servers**: Two Nginx containers serving the application
- **Load Balancer**: HAProxy container distributing traffic
- **Network**: Custom Docker network for container communication

### **Step-by-Step Setup Instructions**

#### **Step 1: Environment Preparation**
```bash
# Update system packages
sudo apt update
sudo apt upgrade

# Install Docker (if not already installed)
sudo apt install docker.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional)
sudo usermod -aG docker $USER
```

#### **Step 2: Clone and Navigate to Project**
```bash
# Clone the repository
git clone https://github.com/Akinloye3264/playing-around-with-apis.git

# Navigate to project directory
cd playing-around-with-apis/

# Verify files are present
ls
```

#### **Step 3: Create Docker Network**
```bash
# Create a custom network for container communication
docker network create emmynet
```

#### **Step 4: Build Web Server Images**
```bash
# Build web-01 image
sudo docker build -f Dockerfile -t web-01 .

# Build web-02 image (same configuration, different tag)
sudo docker build -f Dockerfile -t web-02 .
```

#### **Step 5: Build Load Balancer Image**
```bash
# Build the HAProxy load balancer image
sudo docker build -f Dockerfile.lb -t lb-01 .
```

#### **Step 6: Run Web Server Containers**
```bash
# Run web-01 container
docker run -d --name web-01 --network emmynet web-01

# Run web-02 container
docker run -d --name web-02 --network emmynet web-02
```

#### **Step 7: Run Load Balancer Container**
```bash
# Run the load balancer container
docker run -d --name lb-01 -p 8080:80 --network emmynet lb-01
```

#### **Step 8: Test the Setup**
```bash
# Check if containers are running
docker ps

# Test the load balancer
curl localhost:8080

# Test with verbose output
curl -v localhost:8080

# Check load balancer logs
docker logs lb-01
```

### **Docker Compose Alternative**

For easier management, you can use Docker Compose:

#### **docker-compose.yml Configuration**
```yaml
version: '3.8'
services:
  web-01:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: web-01
    networks:
      - emmynet
    restart: unless-stopped

  web-02:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: web-02
    networks:
      - emmynet
    restart: unless-stopped

  lb-01:
    build:
      context: .
      dockerfile: Dockerfile.lb
    container_name: lb-01
    ports:
      - "8080:80"
    networks:
      - emmynet
    depends_on:
      - web-01
      - web-02
    restart: unless-stopped

networks:
  emmynet:
    driver: bridge
```

#### **Docker Compose Commands**
```bash
# Start all services
docker compose up --build

# Start in detached mode
docker compose up -d --build

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Rebuild and restart
docker compose up --build --force-recreate
```

### **Configuration Files**

#### **Dockerfile (Web Server)**
```dockerfile
# Use Nginx Alpine image
FROM nginx:alpine

# Copy application files
COPY . /usr/share/nginx/html/

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### **Dockerfile.lb (Load Balancer)**
```dockerfile
# Use HAProxy Alpine image
FROM haproxy:alpine

# Copy HAProxy configuration
COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

# Expose port 80
EXPOSE 80

# Start HAProxy
CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]
```

#### **haproxy.cfg**
```haproxy
global
    daemon
    maxconn 4096

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend http_front
    bind *:80
    stats uri /haproxy?stats
    default_backend http_back

backend http_back
    balance roundrobin
    server web01 web-01:80 check
    server web02 web-02:80 check
    option httpchk GET /
    http-check expect status 200
```

#### **nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
}
```

### **Docker Hub Integration**

#### **Push to Docker Hub**
```bash
# Login to Docker Hub
docker login

# Tag images for Docker Hub
docker tag web-01 akinloye3264/web-01:v1
docker tag web-02 akinloye3264/web-02:v1
docker tag lb-01 akinloye3264/lb-01:v1

# Push images to Docker Hub
docker push akinloye3264/web-01:v1
docker push akinloye3264/web-02:v1
docker push akinloye3264/lb-01:v1
```

#### **Pull from Docker Hub**
```bash
# Pull images from Docker Hub
docker pull akinloye3264/web-01:v1
docker pull akinloye3264/web-02:v1
docker pull akinloye3264/lb-01:v1
```

### **Management Commands**

#### **Container Management**
```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop containers
docker stop web-01 web-02 lb-01

# Remove containers
docker rm web-01 web-02 lb-01

# Remove all containers
docker rm -f $(docker ps -aq)

# View container logs
docker logs lb-01
docker logs web-01
docker logs web-02
```

#### **Image Management**
```bash
# List images
docker images

# Remove images
docker rmi web-01 web-02 lb-01

# Remove all images
docker rmi -f $(docker images -q)
```

#### **Network Management**
```bash
# List networks
docker network ls

# Inspect network
docker network inspect emmynet

# Remove network
docker network rm emmynet
```

### **Troubleshooting**

#### **Common Issues and Solutions**

1. **Port Already in Use**
```bash
# Check what's using port 8080
sudo netstat -tulpn | grep :8080

# Kill process using the port
sudo kill -9 <PID>
```

2. **Container Won't Start**
```bash
# Check container logs
docker logs <container-name>

# Check if image exists
docker images

# Rebuild image
docker build -f Dockerfile -t web-01 .
```

3. **Network Issues**
```bash
# Check network connectivity
docker network inspect emmynet

# Recreate network
docker network rm emmynet
docker network create emmynet
```

4. **Load Balancer Not Working**
```bash
# Check HAProxy configuration
docker exec lb-01 cat /usr/local/etc/haproxy/haproxy.cfg

# Test individual web servers
curl http://web-01:80
curl http://web-02:80
```

#### **Testing Load Balancing**
```bash
# Test round-robin distribution
for i in {1..10}; do
    curl -s http://localhost:8080 | grep "Server:" || echo "Request $i"
    sleep 1
done

# Check HAProxy stats
curl http://localhost:8080/haproxy?stats
```

### **Production Deployment**

#### **Environment Variables**
```bash
# Create environment file
cat > .env << EOF
NODE_ENV=production
API_BASE_URL=https://itunes.apple.com
EOF

# Run with environment variables
docker run -d \
  --name web-01 \
  --network emmynet \
  --env-file .env \
  web-01
```

#### **Health Checks**
```bash
# Test application health
curl -I http://localhost:8080

# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}"
```

#### **Monitoring**
```bash
# Monitor resource usage
docker stats

# Monitor logs in real-time
docker logs -f lb-01

# Check HAProxy statistics
curl http://localhost:8080/haproxy?stats
```

## 🎯 How Your Website Works - Step by Step

### 1. **Initial Load & Setup**
When the website loads (`index.html`), the following happens:

1. **HTML Structure Loads**: The main page structure with header, mood grid, and sections
2. **CSS Styling Applied**: `style.css` applies the glassmorphism design with gradients and animations
3. **JavaScript Initialization**: `script.js` sets up event listeners and initializes the audio player

### 2. **User Interface Components**

#### **Header Section**
- **Title**: "Mood Music Finder" with music icon
- **Search Bar**: Allows direct song/artist search
- **Playlist Button**: Quick access to saved songs

#### **Mood Selection Grid**
- **8 Mood Cards**: Each with unique icons and descriptions
- **Interactive Design**: Hover effects and smooth animations
- **Color-Coded**: Each mood has distinct visual identity

### 3. **Mood Selection Process**

When a user clicks on a mood card:

1. **Event Listener Triggered**: `selectMood(mood)` function is called
2. **Loading State**: Overlay appears with spinner
3. **API Call Preparation**: Random keyword selected from mood-specific terms
4. **iTunes API Request**: Fetch request sent to Apple's servers
5. **Data Processing**: Results filtered for songs with preview URLs
6. **Fallback Handling**: If API fails, sample data is used
7. **Results Display**: Search results section becomes visible

### 4. **Music Search Algorithm**

The app uses mood-specific keywords to find relevant songs:

```javascript
const MOOD_SEARCH_TERMS = {
    happy: ['happy', 'joyful', 'upbeat', 'cheerful', 'positive', 'dance', 'party'],
    sad: ['sad', 'melancholic', 'emotional', 'heartbreak', 'lonely', 'tears', 'blue'],
    angry: ['angry', 'rage', 'furious', 'intense', 'powerful', 'aggressive', 'rock'],
    relaxed: ['relaxed', 'calm', 'peaceful', 'chill', 'ambient', 'meditation', 'zen'],
    energetic: ['energetic', 'pump', 'workout', 'motivation', 'power', 'energy', 'fast'],
    romantic: ['romantic', 'love', 'passion', 'romance', 'heart', 'sweet', 'tender'],
    nostalgic: ['nostalgic', 'retro', 'classic', 'oldies', 'memories', 'vintage', 'throwback'],
    focused: ['focused', 'concentration', 'study', 'work', 'productivity', 'instrumental', 'classical']
};
```

### 5. **Song Display & Interaction**

Each song result shows:
- **Album Artwork**: From iTunes API
- **Song Details**: Title, artist, album
- **Action Buttons**: Play and Add to Playlist
- **Mood Badge**: Shows which mood the song was found for

### 6. **Audio Player Functionality**

When a user clicks "Play":

1. **Song Data Set**: Current song object updated
2. **Player UI Updated**: Album art, title, artist displayed
3. **Audio Source Set**: HTML5 Audio element configured
4. **Player Shown**: Floating player appears
5. **Playback Started**: Audio begins streaming from iTunes
6. **Progress Tracking**: Real-time progress bar updates
7. **Time Display**: Current time and total duration shown

### 7. **Playlist Management**

Users can:
- **Add Songs**: Click "Add to Playlist" button
- **View Playlist**: Click playlist button in header
- **Play from Playlist**: Direct playback from saved songs
- **Remove Songs**: Delete unwanted tracks

### 8. **Error Handling & Fallbacks**

The app handles various scenarios:
- **API Failures**: Falls back to sample data
- **Audio Errors**: Shows error messages
- **Network Issues**: Graceful degradation
- **Missing Previews**: Alerts user

## 🔐 Security Hardening

### **Environment Variables for Secrets**

Instead of hardcoding API keys or sensitive data, use environment variables:

#### **Updated Dockerfile with Environment Support**
```dockerfile
# Use an Nginx base image
FROM nginx:alpine

# Install Node.js for environment variable processing
RUN apk add --no-cache nodejs npm

# Copy your site files
COPY . /usr/share/nginx/html

# Create a script to replace environment variables
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'envsubst < /usr/share/nginx/html/index.html > /tmp/index.html' >> /docker-entrypoint.sh && \
    echo 'cp /tmp/index.html /usr/share/nginx/html/index.html' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Start the entrypoint script
CMD ["/docker-entrypoint.sh"]
```

#### **Environment Variables in HTML**
Update `index.html` to use environment variables:
```html
<script>
    window.API_BASE_URL = '${API_BASE_URL}';
    window.APP_VERSION = '${APP_VERSION}';
</script>
```

#### **Production Deployment with Secrets**
```bash
# Create .env file
cat > .env << EOF
API_BASE_URL=https://itunes.apple.com
APP_VERSION=v1.0.0
NODE_ENV=production
EOF

# Run with environment file
docker run -d \
  --name mood-music-app \
  -p 8080:80 \
  --env-file .env \
  yourusername/mood-music-finder:latest
```

#### **Docker Secrets (for Docker Swarm)**
```bash
# Create secret
echo "your-secret-api-key" | docker secret create api_key -

# Deploy with secrets
docker stack deploy -c docker-compose.yml mood-music
```

#### **Kubernetes Secrets (Alternative)**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mood-music-secrets
type: Opaque
data:
  api-key: <base64-encoded-api-key>
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mood-music-finder
spec:
  template:
    spec:
      containers:
      - name: mood-music
        image: yourusername/mood-music-finder:latest
        env:
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: mood-music-secrets
              key: api-key
```

### **Security Best Practices**

1. **Never commit secrets to Git:**
```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo "secrets/" >> .gitignore
```

2. **Use Docker secrets or environment files:**
```bash
# For development
docker run --env-file .env.local playing-around-with-apis

# For production
docker run --env-file .env.production playing-around-with-apis
```

3. **Rotate secrets regularly:**
```bash
# Update secrets
docker secret update api_key new-api-key-value
```

## 🚀 Local Development Setup

### **Option 1: Direct File Access**
Simply open `index.html` in your web browser.

### **Option 2: Local Server**
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## 🔧 API Integration Details

### **iTunes Search API**
- **Endpoint**: `https://itunes.apple.com/search`
- **Method**: GET
- **Parameters**: 
  - `term`: Search keyword (mood-based)
  - `media`: music
  - `entity`: song
  - `limit`: 20 results
- **Response**: JSON with song data including preview URLs

### **Sample API Response**
```json
{
  "resultCount": 20,
  "results": [
    {
      "trackId": 123456789,
      "trackName": "Happy",
      "artistName": "Pharrell Williams",
      "collectionName": "G I R L",
      "artworkUrl100": "https://...",
      "previewUrl": "https://...",
      "trackTimeMillis": 233000
    }
  ]
}
```

## 🎨 Design System

### **Color Palette**
- **Primary Gradient**: #667eea to #764ba2
- **Background**: Gradient background
- **Cards**: Semi-transparent white with blur
- **Text**: Dark gray (#333) for readability

### **Typography**
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Icons**: Font Awesome 6.0

### **Animations**
- **Fade-in**: Cards appear with smooth transitions
- **Hover Effects**: Transform and color changes
- **Loading Spinners**: CSS-based animations
- **Progress Bars**: Real-time audio progress

## 📱 Responsive Design

The application adapts to different screen sizes:
- **Desktop**: Full grid layout with all features
- **Tablet**: Adjusted spacing and sizing
- **Mobile**: Single-column layout with touch-friendly buttons

## 🔒 Security & Performance

### **Security Features**
- **CORS Handling**: Proper API request handling
- **Input Sanitization**: User input validation
- **Error Boundaries**: Graceful error handling

### **Performance Optimizations**
- **Efficient DOM**: Minimal DOM manipulation
- **CSS Optimizations**: Hardware-accelerated animations
- **Audio Preloading**: Smart audio resource management
- **Lazy Loading**: Images and resources loaded as needed

## 🆘 Troubleshooting

### **Common Issues**

1. **Audio Not Playing**
   - Check browser console for errors
   - Verify internet connection
   - Try a different browser

2. **No Search Results**
   - Check API connectivity
   - Verify search terms
   - Try refreshing the page

3. **Docker Issues**
   - Ensure Docker is running
   - Check port availability
   - Verify image build success

4. **Load Balancer Issues**
   - Check server health status
   - Verify configuration syntax
   - Monitor logs for errors

### **Debug Commands**
```bash
# Check Docker container status
docker ps -a

# View container logs
docker logs mood-music-app

# Check browser console
F12 → Console tab

# Test API directly
curl "https://itunes.apple.com/search?term=happy&media=music&entity=song&limit=1"

# Test load balancer
curl -I http://localhost:8080

# Check server health
curl -I http://web-01:80
curl -I http://web-02:80
```

## 🔮 Future Enhancements

- [ ] Real lyrics API integration
- [ ] User authentication and profiles
- [ ] Advanced playlist management
- [ ] Music recommendations engine
- [ ] Social sharing features
- [ ] Offline mode with cached songs
- [ ] Voice commands for mood selection
- [ ] Music visualization
- [ ] Equalizer and audio effects
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the browser console for errors
- Ensure you have an active internet connection
- Try refreshing the page
- Verify browser supports HTML5 Audio API
- Check Docker container logs if using containerized version

---

**Note**: This application uses the iTunes Search API to provide real music data. Preview audio is streamed directly from Apple's servers. The application includes comprehensive fallback data for offline functionality. Which adds restriction on iOS devices.

Below is my video recording demonstrating how my website works briefly.
https://screenapp.io/app/#/shared/gx1y-1IAJf 



