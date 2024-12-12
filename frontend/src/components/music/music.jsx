import React, { useState, useEffect } from 'react';
import './music.css';

function Music({date}) {
    const [randomSongs, setRandomSongs] = useState([]);

    async function getRandomSongs() {
        try {
            const response = await fetch('http://localhost:4000/music', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ date }),
            });

            if (!response.ok) {
            throw new Error('Something went wrong');
            }

            const data = await response.json();
            setRandomSongs(data);

        } catch (error) {
            console.error(error);
            setSong({ error: 'Failed to fetch a song!' });
        } 
    }

    // Get songs when page is rendered
    useEffect(() => {
        getRandomSongs();
    }, [date]); //when date changes fetch again

    return (
        <div class="music-section">

            {date === new Date().toLocaleDateString() && <h2>Today's Songs</h2>}
            {date !== new Date().toLocaleDateString() && <h2>Songs for {date}</h2>}


            {/* {randomSongs.error && <p>{randomSongs.error}</p>} */}

            <div className="songs-container">

                {randomSongs.map((song, index) => (
                    <div key={index} className="song-card">
                        <img src={song.image_url} alt={song.title}/>
                        <h3><a href={song.genius_url}>{song.title}</a></h3>
                        <p>Artist: {song.artist}</p>

                        {/* <p>Full Title: {song.full_title}</p> */}
                    </div>
                ))}
                </div>
            </div>
        );
    }

export default Music;