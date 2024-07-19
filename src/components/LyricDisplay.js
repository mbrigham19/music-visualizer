import React from 'react';

function LyricDisplay({ lyrics }) {
    return (
        <div>
            <h2>Lyrics</h2>
            <pre>{lyrics}</pre>
        </div>
    );
}

export default LyricDisplay;