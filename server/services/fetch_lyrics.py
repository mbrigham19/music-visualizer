import sys
import os
import lyricsgenius # type: ignore

GENIUS_ACCESS_TOKEN = os.getenv('GENIUS_ACCESS_TOKEN')

genius = lyricsgenius.Genius(GENIUS_ACCESS_TOKEN)

def get_lyrics(song_title, artist_name):
    try:
        song = genius.search_song(song_title, artist_name)
        if song:
            return song.lyrics
        else:
            return "Lyrics not found"
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    song_title = sys.argv[1]
    artist_name = sys.argv[2]
    print(get_lyrics(song_title, artist_name))