import React, { useState, useEffect } from 'react';
import './music.css';
import Board from '../board/board';

function Music({date}) {
    const [randomSongs, setRandomSongs] = useState([]);
    const [winner, setWinner] = useState([]);

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
        } 
    }

    async function findWinner() {

        if (!randomSongs || randomSongs.length === 0) {
            console.log("No songs available for this date.");
            setWinner([]);
            return;
        }
    
        let maxVotes = 0;
        let winners = [];
    
        randomSongs.forEach((song) => {
            // let vote = song.votes;
            let vote = parseInt(song.votes);
            if (vote > maxVotes) {
                maxVotes = vote;
                winners = [song];
            } else if (vote === maxVotes && vote > 0) {
                winners.push(song);
            }
        });
    
        console.log("Calculated Winners:", winners);
        setWinner(winners);
    }

    // Get songs when page is rendered
    useEffect(() => {
        console.log("Random Songs:", randomSongs);
        findWinner();
    }, [randomSongs]); //when date changes


    // useEffect(() => {
    //     console.log("Winner State ", winner);
    // }, [winner]);

    // Get songs when page is rendered
    useEffect(() => {
        getRandomSongs();
    }, [date]); //when date changes fetch again

    return (
        <>
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
                        {/* <p>{song.votes}</p> */}
                        {/* <p>Full Title: {song.full_title}</p> */}
                    </div>
                ))}
                </div>
            </div>

            <div className="winner-board">
                {date !== new Date().toLocaleDateString() && <h3>Winner:</h3>}
                {date !== new Date().toLocaleDateString() && winner.length > 0 &&
                    winner.map((song, index) => (
                        <div key={index} className="winner">
                            <p>{song.full_title}</p>
                            <p>Votes: {song.votes}</p>
                        </div>
                    ))
                }
                {date !== new Date().toLocaleDateString() && winner.length === 0 && <p>No winners - No one voted</p>}
                {date === new Date().toLocaleDateString() && <p>Vote for your fav song!</p>}
            </div>

            {/* to pass the songs we fetch here, importing board with date and songs prop */}
            <Board date={date} songs={randomSongs}/>
        </>
        
        );
    }

export default Music;