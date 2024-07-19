import React, { useState } from 'react';
import UploadUI from './components/UploadUI';
import LyricDisplay from './components/LyricDisplay';
import axios from 'axios';

function App() {
    const [lyrics, setLyrics] = useState('');

    const fetchLyrics = async (song, artist) => {
        try {
            const response = await axios.get('api/lyrics', { 
                params: { song, artist }
            });
            setLyrics(response.data.lyrics);
        } catch (error) {
            console.error('Error fetching lyrics', error);
        }
    };

    return (
        <div>
            <UploadUI fetchLyrics={fetchLyrics} />
            <LyricDisplay lyrics={lyrics} />
        </div>
    )
}

export default App;