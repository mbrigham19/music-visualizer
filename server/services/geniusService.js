const { exec } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const getLyrics = (songTitle, artistName) => {
  return new Promise((resolve, reject) => {
    // Execute Python script to fetch lyrics
    const scriptPath = path.join(__dirname, 'fetch_lyrics.py');
    const command = `python3 ${scriptPath} "${songTitle}" "${artistName}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`);
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

module.exports = { getLyrics };