import React, { useState } from 'react';

function UploadUI({ fetchLyrics }) {
    const [song, setSong] = useState('');
    const [artist, setArtist] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchLyrics(song, artist);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Song Title" value={song} onChange={(e) => setSong(e.target.value)} />
            <input type="text" placeholder="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
            <button type="submit">Fetch Lyrics</button>
        </form>
    );
}

export default UploadUI;