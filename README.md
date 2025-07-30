# Mood Music Finder

A modern, interactive music discovery application that helps you find the perfect music based on your current mood. Using the iTunes API, this app searches for songs that match your emotional state and provides a complete music listening experience.

## 🎵 Features

### Core Features
- **Mood-Based Search**: 8 different moods to choose from (Happy, Sad, Angry, Relaxed, Energetic, Romantic, Nostalgic, Focused)
- **iTunes API Integration**: Real music data from Apple's iTunes Store
- **Music Playback**: Built-in audio player with preview functionality
- **Song Information**: Complete track details including artist, album, and artwork
- **Lyrics Display**: Lyrics modal for each song (demo version)
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

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API calls and audio streaming
- No API key required (iTunes API is free and public)

## 🚀 Setup & Installation

### 1. Run the Application

Simply open `index.html` in your web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## 📁 Project Structure

```
mood-music-finder/
├── index.html          # Main HTML file
├── style.css           # CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🎯 How It Works

### 1. Mood Selection
- Choose from 8 different moods with intuitive icons
- Each mood has specific search keywords optimized for music discovery
- Interactive cards with hover effects and animations

### 2. Music Search
- Uses iTunes Search API to find relevant songs
- Mood-specific keywords ensure relevant results
- Filters songs with available preview URLs
- Fallback to sample data if API is unavailable

### 3. Music Playback
- Built-in HTML5 audio player
- Real-time progress tracking
- Play/pause controls
- Time display and duration

### 4. Song Information
- Complete track details from iTunes
- Album artwork display
- Artist and album information
- Preview audio streaming

## 🎨 UI Components

### 1. Header Section
- Application title with music icon
- Description and branding

### 2. Mood Grid
- 8 mood cards with unique icons
- Hover effects and animations
- Color-coded for easy identification

### 3. Search Results
- Song cards with artwork and details
- Play and lyrics buttons
- Responsive grid layout

### 4. Music Player
- Floating player with album art
- Progress bar and time display
- Play/pause controls
- Close functionality

### 5. Lyrics Modal
- Centered modal for lyrics display
- Song title and artist information
- Scrollable content area

## 🔧 API Integration

### iTunes Search API
- **Endpoint**: `https://itunes.apple.com/search`
- **Parameters**: 
  - `term`: Search keyword (mood-based)
  - `media`: music
  - `entity`: song
  - `limit`: 20 results
- **Response**: JSON with song data including preview URLs

### Mood Search Keywords
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

## 📊 Sample Data

The application includes comprehensive sample data for each mood:

### Sample Songs by Mood
- **Happy**: Pharrell Williams - "Happy", Owl City - "Good Time"
- **Sad**: Adele - "Someone Like You", John Legend - "All of Me"
- **Angry**: Linkin Park - "In The End", Limp Bizkit - "Break Stuff"
- **Relaxed**: Marconi Union - "Weightless", Debussy - "Claire de Lune"
- **Energetic**: Survivor - "Eye of the Tiger", Queen - "We Will Rock You"
- **Romantic**: Ed Sheeran - "Perfect", Bruno Mars - "Just the Way You Are"
- **Nostalgic**: Queen - "Bohemian Rhapsody", Eagles - "Hotel California"
- **Focused**: Beethoven - "Moonlight Sonata", Vivaldi - "The Four Seasons"

## 🎵 Audio Features

### HTML5 Audio Player
- Native browser audio support
- Cross-platform compatibility
- Real-time progress tracking
- Error handling for unavailable previews

### Audio Controls
- Play/pause functionality
- Progress bar with visual feedback
- Current time and total duration display
- Automatic play/pause button updates

## 🎨 Design Features

### Modern UI Elements
- Glassmorphism effects with backdrop blur
- Gradient backgrounds and buttons
- Smooth hover animations
- Responsive grid layouts
- Custom scrollbars

### Color Scheme
- Primary: Purple gradient (#667eea to #764ba2)
- Background: Gradient background
- Cards: Semi-transparent white with blur
- Text: Dark gray for readability

### Animations
- Fade-in animations for cards
- Hover effects with transforms
- Loading spinners
- Smooth transitions

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Error Handling

- Graceful API error handling
- Fallback to sample data
- User-friendly error messages
- Loading states and spinners
- Audio playback error handling

## 🚀 Performance Features

- Efficient DOM manipulation
- Optimized CSS animations
- Minimal API calls
- Fast loading times
- Audio preloading

## 🔮 Future Enhancements

- [ ] Real lyrics API integration
- [ ] Playlist creation and management
- [ ] User favorites and history
- [ ] Advanced mood combinations
- [ ] Music recommendations
- [ ] Social sharing features
- [ ] Offline mode with cached songs
- [ ] Voice commands for mood selection
- [ ] Music visualization
- [ ] Equalizer and audio effects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the browser console for errors
- Ensure you have an active internet connection
- Try refreshing the page
- Verify browser supports HTML5 Audio API

## 📊 API Usage

### iTunes API Limits
- No rate limiting for public use
- Free to use without API key
- CORS enabled for browser requests
- Real-time music data

### Best Practices
- Handle API errors gracefully
- Use fallback data when needed
- Cache responses when possible
- Monitor audio playback errors

## 🎵 Mood Categories

### Happy 😊
- Upbeat and joyful tunes
- Dance and party music
- Positive and cheerful songs

### Sad 💙
- Melancholic and reflective
- Emotional and heartbreak songs
- Blue and lonely themes

### Angry 🔥
- Intense and powerful
- Aggressive rock music
- Rage and fury themes

### Relaxed 🌊
- Calm and peaceful
- Ambient and meditation music
- Chill and zen vibes

### Energetic ⚡
- High-energy and dynamic
- Workout and motivation music
- Fast and powerful beats

### Romantic 💕
- Love and passion
- Sweet and tender songs
- Heart and romance themes

### Nostalgic 🕰️
- Memories and nostalgia
- Retro and classic hits
- Vintage and throwback music

### Focused 🧠
- Concentration and productivity
- Instrumental and classical
- Study and work music

---

**Note**: This application uses the iTunes Search API to provide real music data. Preview audio is streamed directly from Apple's servers. The lyrics feature is currently a demo and would require integration with a lyrics API service for full functionality.
