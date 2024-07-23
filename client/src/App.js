import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { fetchCurrentTrack } from './apiService';

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [lyrics, setLyrics] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState('');
  const [currentLyric, setCurrentLyric] = useState('');

  useEffect(() => {
    const getCurrentTrack = async () => {
      try {
        const currentTrackData = await fetchCurrentTrack();
        if (currentTrackData) {
          setCurrentTrack(currentTrackData.track);
          setLyrics(parseLyrics(currentTrackData.lyrics));
          console.log({ lyrics: parseLyrics(currentTrackData.lyrics) });
        } else {
          setCurrentTrack(null);
          setLyrics([]);
        }
      } catch (error) {
        console.error('Error fetching current track', error);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const accessToken = urlParams.get('access_token');
    if (code && accessToken) {
      localStorage.setItem('spotify_access_token', accessToken);
      setIsLoggedIn(true);
      window.history.replaceState({}, document.title, "/"); // Remove code and access_token from URL
      getCurrentTrack();
    }

    if (isLoggedIn && window.spotifySDKReady) {
      initializePlayer();
    }
  }, [isLoggedIn]);

  const initializePlayer = () => {
    const token = localStorage.getItem('spotify_access_token'); // Ensure the token is stored in localStorage
    console.log('Initializing Spotify Player with token:', token);

    const player = new window.Spotify.Player({
      name: 'Music Visualizer',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5
    });

    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      setDeviceId(device_id);
    });

    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    player.addListener('player_state_changed', state => {
      if (!state) return;
      const currentTime = state.position / 1000;
      updateLyrics(currentTime);
    });

    player.addListener('initialization_error', ({ message }) => {
      console.error('Failed to initialize', message);
    });

    player.addListener('authentication_error', ({ message }) => {
      console.error('Failed to authenticate', message);
    });

    player.addListener('account_error', ({ message }) => {
      console.error('Failed to validate Spotify account', message);
    });

    player.addListener('playback_error', ({ message }) => {
      console.error('Failed to perform playback', message);
    });

    player.connect().then(success => {
      if (success) {
        console.log('The Web Playback SDK successfully connected to Spotify!');
        setPlayer(player);
      } else {
        console.error('The Web Playback SDK could not connect to Spotify.');
      }
    });
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:5001/login'; // Redirect to backend login
  };

  const handlePlay = async () => {
    if (currentTrack && player && deviceId) {
      try {
        await axios.put(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            uris: [currentTrack.uri]
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('spotify_access_token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        player.resume();
      } catch (error) {
        console.error('Error playing track:', error);
      }
    }
  };

  const parseLyrics = (lyricsText) => {
    console.log({ lyricsText })
    const lines = lyricsText.split('\n');
    return lines.map(line => {
      const [timestamp, text] = line.split(']');
      const time = timestamp.replace('[', '').split(':');
      const seconds = parseInt(time[0], 10) * 60 + parseFloat(time[1]);
      return { seconds, text };
    });
  };

  const updateLyrics = (currentTime) => {
    const currentLyricLine = lyrics.find(lyric => lyric.seconds > currentTime);
    if (currentLyricLine) {
      setCurrentLyric(currentLyricLine.text);
    }
  };

  return (
    <div className="container">
      <h1>Music Visualizer</h1>
      {!isLoggedIn ? (
        <button onClick={handleLogin}>Log in with Spotify</button>
      ) : (
        <>
          {currentTrack ? (
            <div className="current-track">
              <h2>Currently Playing</h2>
              <p>
                {currentTrack.name} by {currentTrack.artists.map(artist => artist.name).join(', ')}
              </p>
              <p>Album: {currentTrack.album.name}</p>
              <img src={currentTrack.album.images[0].url} alt="Album cover" />
              <button onClick={handlePlay}>Play</button>
              <pre>{currentLyric}</pre>
              {/* Add visualizations here */}
            </div>
          ) : (
            <p>No track currently playing</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;