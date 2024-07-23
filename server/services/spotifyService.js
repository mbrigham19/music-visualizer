const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://localhost:5001/callback',
});

const getAuthorizationUrl = () => {
  const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-library-read', 'playlist-read-private'];
  return spotifyApi.createAuthorizeURL(scopes);
};

const setAccessToken = (accessToken) => {
  spotifyApi.setAccessToken(accessToken);
};

const setRefreshToken = (refreshToken) => {
  spotifyApi.setRefreshToken(refreshToken);
};

const refreshAccessToken = async () => {
  try {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body['access_token']);
    return data.body;
  } catch (error) {
    console.error('Could not refresh access token', error);
  }
};

const getCurrentlyPlayingTrack = async () => {
  try {
    const data = await spotifyApi.getMyCurrentPlaybackState();
    return data.body;
  } catch (error) {
    console.error('Error getting current playback state', error);
  }
};

module.exports = {
  getAuthorizationUrl,
  setAccessToken,
  setRefreshToken,
  refreshAccessToken,
  getCurrentlyPlayingTrack,
};