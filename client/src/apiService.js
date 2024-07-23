import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

// Get the currently playing track and its lyrics, from Spotify and Genius
export const fetchCurrentTrack = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/current-track`);
    return response.data;
  } catch (error) {
    console.error('Error fetching current track', error);
  }
}


export const searchSongs = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching songs:', error);
    throw error;
  }
};

export const getSongDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/song/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting song details:', error);
    throw error;
  }
};

export const getLyrics = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/lyrics`, {
      params: { query },
    });
    return response.data.lyrics;
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    throw error;
  }
};