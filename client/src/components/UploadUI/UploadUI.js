import React, { useState } from 'react';
import { searchSongs, getSongDetails, getLyrics } from '../../apiService';
import './UploadUI.css';

const UploadUI = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [lyrics, setLyrics] = useState('');

  const handleSearch = async () => {
    try {
      const results = await searchSongs(query);
      setResults(results);
    } catch (error) {
      console.error('Error searching songs:', error);
    }
  };

  const handleSelectSong = async (songId) => {
    try {
      const song = await getSongDetails(songId);
      setSelectedSong(song);
      const lyrics = await getLyrics(song.title);
      setLyrics(lyrics);
    } catch (error) {
      console.error('Error getting song details or lyrics:', error);
    }
  };

  return (
    <div className="UploadUI">
      <h1>Genius Lyrics Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a song..."
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {results.map((hit) => (
          <div key={hit.result.id} onClick={() => handleSelectSong(hit.result.id)}>
            {hit.result.full_title}
          </div>
        ))}
      </div>
      {selectedSong && (
        <div>
          <h2>{selectedSong.full_title}</h2>
          <a href={selectedSong.url} target="_blank" rel="noopener noreferrer">
            View Lyrics
          </a>
          <pre>{lyrics}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadUI;