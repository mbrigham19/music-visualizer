const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const GENIUS_API_URL = process.env.GENIUS_API_URL;
const GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;
const geniusHeaders = {
    Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`
};

app.use(express.static('public'));

app.get('/api/lyrics', async (req, res) => {
    const { song, artist } = req.query;
    try {
        const response = await axios.get(`${GENIUS_API_URL}/search?q=${song} ${artist}`, {
            headers: geniusHeaders,
        });
        const songId = response.data.response.hits[0].result.id;
        const songResponse = await axios.get(`${GENIUS_API_URL}/songs/${songId}`, {
            headers: geniusHeaders,
        });
        const lyricsPath = songResponse.data.response.song.path;
        const lyricsPage = await axios.get(`${GENIUS_API_URL}${lyricsPath}`);
        const lyrics = lyricsPage.data.match(/<div class="lyrics">([^]*?)<\/div>/)[1];
        res.json({ lyrics });

    } catch (error) {
        res.status(500).send('Error fetching lyrics', { error });
    }
});

// Catch-all handler to serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});


app.listen(port, () => console.log(`Server running on port ${port}`));