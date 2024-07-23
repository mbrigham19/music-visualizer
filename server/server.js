const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const { getLyrics } = require('./services/geniusService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true,
}));

// Spotify API setup
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://localhost:5001/callback',
});

// Get Spotify authorization URL
const getAuthorizationUrl = () => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-library-read',
    'playlist-read-private',
  ];
  return spotifyApi.createAuthorizeURL(scopes);
};

// Serve static assets if in production
app.use(express.static(path.join(__dirname, 'build')));

// Authorization routes
app.get('/login', (req, res) => {
  const authorizeURL = getAuthorizationUrl();
  res.redirect(authorizeURL);
});

// This route is called after Spotify authorization, and it sets the access token and refresh token, then redirects back to the frontend
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    // Store the access token in localStorage
    res.redirect(`http://localhost:3000?code=${code}&access_token=${accessToken}`); // Pass code and access token back to frontend
  } catch (error) {
    console.error('Error during Spotify authorization', error);
    res.redirect('/login');
  }
});

// Get current track and lyrics
app.get('/api/current-track', async (req, res) => {
  try {
    const data = await spotifyApi.getMyCurrentPlaybackState();
    console.log('Current playback state:', { state: data.body });
    if (data.body && data.body.is_playing) {
      const track = data.body.item;
      console.log('Current track:', { track});
      const lyrics = await getLyrics(track.name, track.artists[0].name);
      console.log('Lyrics:', { lyrics });
      res.json({ track, lyrics });
    } else {
      res.status(200).send({ message: 'No track currently playing' });
    }
  } catch (error) {
    console.error('Error getting current track', error);
    res.status(500).send('Error getting current track');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));