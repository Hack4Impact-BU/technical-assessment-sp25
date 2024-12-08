import React, { useState, useEffect } from 'react';
import './music.css';

function Music() {
    const [song, setSong] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);

    async function getRandomSong() {
        try {
            //fetching the song, disable button
            setIsDisabled(true);
            const response = await fetch('http://localhost:4000/music', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            });
            if (!response.ok) {
            throw new Error('Something went wrong');
            }
            const data = await response.json();
            setSong(data);
        } catch (error) {
            console.error(error);
            setSong({ error: 'Failed to fetch a song!' });
        } finally {
            //found the song set it false
            setIsDisabled(false);
        }
    }

    return (
        <div id="music">
            <button onClick={getRandomSong} disabled={isDisabled}>
            {isDisabled ? 'Loading...' : 'Get Random Song'}
            </button>
            {song && song.error && <p>{song.error}</p>}
            {song && (
            <div className="song-details">
                <h3>{song.title}</h3>
                <p>Artist: {song.artist}</p>
            </div>
            )}
        </div>
        );
    }

export default Music;