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
- **Containerization**: Docker with Nginx

## 📁 Project Structure

```
playing-around-with-apis/
├── index.html          # Main HTML file
├── style.css           # CSS styles and animations
├── script.js           # JavaScript functionality
├── download.jpg        # Favicon image
├── Dockerfile          # Docker configuration
└── README.md           # This file
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

## 🐳 Docker Setup & Deployment

### **Step-by-Step Docker Setup Process**

#### **Step 1: Clone the Repository**
```bash
git clone <your-repository-url>
cd playing-around-with-apis
```

#### **Step 2: Understanding the Dockerfile**
The `Dockerfile` contains:
```dockerfile
# Use an Nginx base image
FROM nginx:alpine

# Remove default index page and copy your site files
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

**What this does:**
- Uses lightweight Alpine Linux Nginx image
- Copies all project files to Nginx's web directory
- Exposes port 80 for web traffic
- Starts Nginx in foreground mode

#### **Step 3: Build the Docker Image**
```bash
# Build the image with a tag
docker build -t mood-music-finder .

# This command:
# - docker build: Builds a Docker image
# - -t mood-music-finder: Tags the image with a name
# - .: Uses the current directory (where Dockerfile is located)
```

#### **Step 4: Run the Container**
```bash
# Run the container
docker run -d -p 8080:80 --name mood-music-app mood-music-finder

# This command:
# - docker run: Creates and starts a container
# - -d: Runs in detached mode (background)
# - -p 8080:80: Maps host port 8080 to container port 80
# - --name mood-music-app: Names the container
# - mood-music-finder: Uses the image we built
```

#### **Step 5: Access the Application**
Open your web browser and visit:
```
http://localhost:8080
```

### **Alternative: Using Docker Compose**

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  mood-music-finder:
    build: .
    ports:
      - "8080:80"
    container_name: mood-music-app
    restart: unless-stopped
```

Then run:
```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down

# View logs
docker-compose logs -f
```

### **Docker Commands Reference**

```bash
# Build the image
docker build -t mood-music-finder .

# Run the container
docker run -d -p 8080:80 --name mood-music-app mood-music-finder

# Stop the container
docker stop mood-music-app

# Remove the container
docker rm mood-music-app

# View running containers
docker ps

# View container logs
docker logs mood-music-app

# Access container shell
docker exec -it mood-music-app sh

# Remove the image
docker rmi mood-music-finder
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

**Note**: This application uses the iTunes Search API to provide real music data. Preview audio is streamed directly from Apple's servers. The application includes comprehensive fallback data for offline functionality. and there is also a restriction on Ios devices. 

Below is my video recording demonstrating how my website works briefly.
https://screenapp.io/app/#/shared/gx1y-1IAJf



