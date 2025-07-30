
const ITUNES_API_BASE = 'https://itunes.apple.com/search';


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
let currentMood = null;
let currentSong = null;
let audioPlayer = null;
let searchResults = [];
let playlist = [];
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    initializeAudioPlayer();    
    const showPlaylistBtn = document.getElementById('showPlaylistBtn');
    if (showPlaylistBtn) {
        showPlaylistBtn.addEventListener('click', function() {
            let playlistSection = document.getElementById('playlistSection');
            if (playlistSection) {
                playlistSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                showPlaylist();
                playlistSection = document.getElementById('playlistSection');
                if (playlistSection) {
                    playlistSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
});


function setupEventListeners() {
    document.querySelectorAll('.mood-card').forEach(card => {
        card.addEventListener('click', () => selectMood(card.dataset.mood));
    });
    document.getElementById('backBtn').addEventListener('click', showMoodSelection);
     document.getElementById('closePlayer').addEventListener('click', hidePlayer);
    document.getElementById('closeLyrics').addEventListener('click', hideLyrics);
    document.getElementById('playPauseBtn').addEventListener('click', togglePlayPause);
    const songSearchForm = document.getElementById('songSearchForm');
    if (songSearchForm) {
        songSearchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const query = document.getElementById('songSearchInput').value.trim();
            if (query) {
                await searchMusicByQuery(query);
                showSearchResults();
            }
        });
    }
}

function initializeAudioPlayer() {
    audioPlayer = new Audio();
    audioPlayer.addEventListener('loadedmetadata', updatePlayerTime);
    audioPlayer.addEventListener('timeupdate', updatePlayerProgress);
    audioPlayer.addEventListener('ended', onSongEnd);
    audioPlayer.addEventListener('error', onPlayerError);
    audioPlayer.addEventListener('play', updatePlayPauseButton);
    audioPlayer.addEventListener('pause', updatePlayPauseButton);
}

async function selectMood(mood) {
    currentMood = mood;
    showLoadingOverlay();
    
    try {
        await searchMusicByMood(mood);
        showSearchResults();
    } catch (error) {
        console.error('Error searching for music:', error);
        showError('searchResults', 'Failed to search for music. Please try again.');
    } finally {
        hideLoadingOverlay();
    }
}


async function searchMusicByMood(mood) {
    const searchTerms = MOOD_SEARCH_TERMS[mood];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    try {
        const response = await fetch(`${ITUNES_API_BASE}?term=${encodeURIComponent(randomTerm)}&media=music&entity=song&limit=20`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            searchResults = data.results;
            searchResults = searchResults.filter(song => song.previewUrl);
        } else {
            throw new Error('No songs found');
        }
        
    } catch (error) {
        console.error('Error fetching from iTunes API:', error);
        searchResults = generateSampleSongs(mood);
    }
}

async function searchMusicByQuery(query) {
    showLoadingOverlay();
    try {
        const response = await fetch(`${ITUNES_API_BASE}?term=${encodeURIComponent(query)}&media=music&entity=song&limit=20`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            searchResults = data.results.filter(song => song.previewUrl);
        } else {
            throw new Error('No songs found');
        }
    } catch (error) {
        console.error('Error searching for songs:', error);
        showError('searchResults', 'No results found. Please try a different search.');
        searchResults = [];
    } finally {
        hideLoadingOverlay();
    }
}

function displaySearchResults() {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
    if (searchResults.length === 0) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>No songs found for this mood. Try another mood!</p>
            </div>
        `;
        return;
    }
    
    searchResults.forEach((song, index) => {
        const card = createSongCard(song, index);
        resultsContainer.appendChild(card);
    });
}


function createSongCard(song, index) {
    const card = document.createElement('div');
    card.className = 'song-card';
    const artwork = song.artworkUrl100 || song.artworkUrl60 || 'https://via.placeholder.com/60x60/667eea/ffffff?text=🎵';
    card.innerHTML = `
        <div class="song-header">
            <img src="${artwork}" alt="Album Art" class="song-artwork">
            <div class="song-details">
                <h4>${song.trackName || 'Unknown Song'}</h4>
                <p>${song.artistName || 'Unknown Artist'}</p>
                <p>${song.collectionName || 'Unknown Album'}</p>
            </div>
        </div>
        <div class="song-actions">
            <button class="action-btn" onclick="playSong(${index})">
                <i class="fas fa-play"></i> Play
            </button>
            <button class="action-btn" onclick="addToPlaylist(searchResults[${index}])">
                <i class="fas fa-plus"></i> Add to Playlist
            </button>
        </div>
    `;

    return card;
}

function playSong(index) {
    const song = searchResults[index];
    if (!song || !song.previewUrl) {
        alert('Preview not available for this song');
            return;
        }
currentSong = song;
    document.getElementById('albumArt').src = song.artworkUrl100 || song.artworkUrl60 || 'https://via.placeholder.com/120x120/667eea/ffffff?text=🎵';
    document.getElementById('songTitle').textContent = song.trackName || 'Unknown Song';
    document.getElementById('artistName').textContent = song.artistName || 'Unknown Artist';
    document.getElementById('albumName').textContent = song.collectionName || 'Unknown Album';
    audioPlayer.src = song.previewUrl;
    audioPlayer.load();

    showPlayer();
    
    audioPlayer.play().catch(error => {
        console.error('Error playing audio:', error);
        alert('Unable to play this song. Please try another one.');
    });
}

function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}

function updatePlayerProgress() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    const currentTime = formatTime(audioPlayer.currentTime);
    const totalTime = formatTime(audioPlayer.duration);
    document.getElementById('currentTime').textContent = currentTime;
    document.getElementById('totalTime').textContent = totalTime;
}


function updatePlayerTime() {
    const totalTime = formatTime(audioPlayer.duration);
    document.getElementById('totalTime').textContent = totalTime;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
     const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
function onSongEnd() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function onPlayerError() {
    alert('Error playing this song. Please try another one.');
}

function generateSampleSongs(mood) {
    const sampleSongs = {
        happy: [
            {
                trackName: 'Happy',
                artistName: 'Pharrell Williams',
                collectionName: 'G I R L',
                artworkUrl100: 'https://via.placeholder.com/100x100/FFD700/ffffff?text=😊',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_01.mp3'
            },
            {
                trackName: 'Good Time',
                artistName: 'Owl City & Carly Rae Jepsen',
                collectionName: 'The Midsummer Station',
                artworkUrl100: 'https://via.placeholder.com/100x100/FF6B6B/ffffff?text=🎵',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_02.mp3'
            }
        ],
        sad: [
            {
                trackName: 'Someone Like You',
                artistName: 'Adele',
                collectionName: '21',
                artworkUrl100: 'https://via.placeholder.com/100x100/4A90E2/ffffff?text=💙',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_03.mp3'
            },
            {
                trackName: 'All of Me',
                artistName: 'John Legend',
                collectionName: 'Love in the Future',
                artworkUrl100: 'https://via.placeholder.com/100x100/9B59B6/ffffff?text=💜',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_04.mp3'
            }
        ],
        angry: [
            {
                trackName: 'In The End',
                artistName: 'Linkin Park',
                collectionName: 'Hybrid Theory',
                artworkUrl100: 'https://via.placeholder.com/100x100/E74C3C/ffffff?text=🔥',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_05.mp3'
            },
            {
                trackName: 'Break Stuff',
                artistName: 'Limp Bizkit',
                collectionName: 'Significant Other',
                artworkUrl100: 'https://via.placeholder.com/100x100/8B4513/ffffff?text=⚡',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_06.mp3'
            }
        ],
        relaxed: [
            {
                trackName: 'Weightless',
                artistName: 'Marconi Union',
                collectionName: 'Different Colours',
                artworkUrl100: 'https://via.placeholder.com/100x100/87CEEB/ffffff?text=🌊',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_07.mp3'
            },
            {
                trackName: 'Claire de Lune',
                artistName: 'Debussy',
                collectionName: 'Suite Bergamasque',
                artworkUrl100: 'https://via.placeholder.com/100x100/98FB98/ffffff?text=🌿',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_08.mp3'
            }
        ],
        energetic: [
            {
                trackName: 'Eye of the Tiger',
                artistName: 'Survivor',
                collectionName: 'Eye of the Tiger',
                artworkUrl100: 'https://via.placeholder.com/100x100/FF4500/ffffff?text=💪',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_09.mp3'
            },
            {
                trackName: 'We Will Rock You',
                artistName: 'Queen',
                collectionName: 'News of the World',
                artworkUrl100: 'https://via.placeholder.com/100x100/FFD700/ffffff?text=👑',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_10.mp3'
            }
        ],
        romantic: [
            {
                trackName: 'Perfect',
                artistName: 'Ed Sheeran',
                collectionName: '÷ (Divide)',
                artworkUrl100: 'https://via.placeholder.com/100x100/FF69B4/ffffff?text=💕',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_11.mp3'
            },
            {
                trackName: 'Just the Way You Are',
                artistName: 'Bruno Mars',
                collectionName: 'Doo-Wops & Hooligans',
                artworkUrl100: 'https://via.placeholder.com/100x100/FF1493/ffffff?text=💖',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_12.mp3'
            }
        ],
        nostalgic: [
            {
                trackName: 'Bohemian Rhapsody',
                artistName: 'Queen',
                collectionName: 'A Night at the Opera',
                artworkUrl100: 'https://via.placeholder.com/100x100/8A2BE2/ffffff?text=🎭',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_13.mp3'
            },
            {
                trackName: 'Hotel California',
                artistName: 'Eagles',
                collectionName: 'Hotel California',
                artworkUrl100: 'https://via.placeholder.com/100x100/CD853F/ffffff?text=🏨',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_14.mp3'
            }
        ],
        focused: [
            {
                trackName: 'Moonlight Sonata',
                artistName: 'Beethoven',
                collectionName: 'Piano Sonatas',
                artworkUrl100: 'https://via.placeholder.com/100x100/2F4F4F/ffffff?text=🎹',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_15.mp3'
            },
            {
                trackName: 'The Four Seasons',
                artistName: 'Vivaldi',
                collectionName: 'Le quattro stagioni',
                artworkUrl100: 'https://via.placeholder.com/100x100/228B22/ffffff?text=🍃',
                previewUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_biased/blizzard_16.mp3'
            }
        ]
    };
    
    return sampleSongs[mood] || sampleSongs.happy;
}
function showSearchResults() {
    document.querySelector('.mood-section').style.display = 'none';
    document.getElementById('searchSection').style.display = 'block';
    document.getElementById('currentMood').textContent = currentMood;
    displaySearchResults();
}

function showMoodSelection() {
    document.querySelector('.mood-section').style.display = 'block';
    document.getElementById('searchSection').style.display = 'none';
    currentMood = null;
    searchResults = [];
}


function showPlayer() {
    document.getElementById('playerSection').style.display = 'block';
}


function hidePlayer() {
    document.getElementById('playerSection').style.display = 'none';
    if (audioPlayer) {
        audioPlayer.pause();
    }
}


function showLyricsModal() {
    document.getElementById('lyricsSection').style.display = 'block';
}


function hideLyrics() {
    document.getElementById('lyricsSection').style.display = 'none';
}


function showLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}


function hideLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'none';
}


function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
}


function updatePlayPauseButton() {
    const button = document.getElementById('playPauseBtn');
    if (audioPlayer && !audioPlayer.paused) {
        button.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        button.innerHTML = '<i class="fas fa-play"></i>';
    }
}


function formatDuration(milliseconds) {
    if (!milliseconds) return '0:00';
     const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function truncateText(text, maxLength = 50) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function showSuccessMessage(message) {
    const msgDiv = document.getElementById('successMessage');
    if (msgDiv) {
        msgDiv.textContent = message;
        msgDiv.style.display = 'block';
        msgDiv.style.background = '#4BB543';
        msgDiv.style.color = '#fff';
        msgDiv.style.padding = '10px 20px';
        msgDiv.style.borderRadius = '5px';
        msgDiv.style.margin = '10px auto';
        msgDiv.style.textAlign = 'center';
        msgDiv.style.maxWidth = '400px';
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 2000);
    }
}

function addToPlaylist(song) {
    if (!playlist.some(s => s.trackId === song.trackId)) {
        playlist.push(song);
        showPlaylist();
        showSuccessMessage('Song added to playlist successfully!');
    }
}

function removeFromPlaylist(index) {
    playlist.splice(index, 1);
    showPlaylist();
}

function playPlaylistSong(index) {
    const song = playlist[index];
    if (song) {
        currentSong = song;
        audioPlayer.src = song.previewUrl;
        audioPlayer.load();
        showPlayer();
        audioPlayer.play().catch(error => {
            alert('Unable to play this song.');
        });
    }
}

function showPlaylist() {
    let playlistSection = document.getElementById('playlistSection');
    if (!playlistSection) {
        playlistSection = document.createElement('div');
        playlistSection.id = 'playlistSection';
        playlistSection.className = 'playlist-section';
        playlistSection.innerHTML = '<h3>Playlist</h3><div id="playlistSongs" class="search-results"></div>';
        const playerSection = document.getElementById('playerSection');
        if (playerSection && playerSection.parentNode) {
            playerSection.parentNode.insertBefore(playlistSection, playerSection.nextSibling);
        } else {
            document.body.appendChild(playlistSection);
        }
    }
    const playlistSongs = playlistSection.querySelector('#playlistSongs');
    if (playlist.length === 0) {
        playlistSongs.innerHTML = '<p>Your playlist is empty.</p>';
        return;
    }
    
 
    playlistSongs.innerHTML = '';
    
  
    playlist.forEach((song, index) => {
        const card = createPlaylistSongCard(song, index);
        playlistSongs.appendChild(card);
    });
}

function createPlaylistSongCard(song, index) {
    const card = document.createElement('div');
    card.className = 'song-card';
    const artwork = song.artworkUrl100 || song.artworkUrl60 || 'https://via.placeholder.com/60x60/667eea/ffffff?text=🎵';
    card.innerHTML = `
        <div class="song-header">
            <img src="${artwork}" alt="Album Art" class="song-artwork">
            <div class="song-details">
                <h4>${song.trackName || 'Unknown Song'}</h4>
                <p>${song.artistName || 'Unknown Artist'}</p>
                <p>${song.collectionName || 'Unknown Album'}</p>
            </div>
        </div>
        <div class="song-actions">
            <button class="action-btn" onclick="playPlaylistSong(${index})">
                <i class="fas fa-play"></i> Play
            </button>
            <button class="action-btn secondary" onclick="removeFromPlaylist(${index})">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `;
    return card;
}
