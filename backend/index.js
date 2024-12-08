import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

dotenv.config()// Loads the variables from .env into process.env

//allows to define routes and decide how the server should respond to different types of requests
const app = express()

//enable cross-origin requests to communicate with frontend
app.use(cors()) 

//parse incoming request bodies into JSON
app.use(bodyParser.json())

const PORT = process.env.PORT || 4000;
const GENIUS_ACCESS_TOKEN = process.env.GENIUS_CLIENT_ACCESS_TOKEN;

async function fetchSongById(songId) {
    const url = `https://api.genius.com/songs/${songId}`;
    const headers = {
        Authorization: `Bearer ${process.env.GENIUS_CLIENT_ACCESS_TOKEN}`,
    };

    try {
        //fetch song
        const response = await fetch(url, { headers });
        const data = await response.json();
        if (response.ok) {
            return data.response.song; // Return the song if successful
        }
        return null; // Return null if the song doesn't exist
    } catch (error) {
        console.error(`Failed to fetch song with ID ${songId}: ${error.message}`);
        return null; // Return null on failure
    }
}

// POST endpoint to get a random song in frontend
app.post('/music', async (req, res) => {
    let song = null;
    let attempts = 0;

    while (!song && attempts < 20) { // try 20 times
        //generating 6 digit id
        const randomId = Math.floor(100000 + Math.random() * 900000); 
        console.log(`random song ID: ${randomId}`);
        //attempt to fetch song
        song = await fetchSongById(randomId);
        attempts++;
    }

    //if song is found, send JSON response
    if (song) {
        res.json({
            id: song.id,
            title: song.title,
            artist: song.primary_artist.name,
        });
    } else {
        res.status(404).json({ error: 'Could not find a valid song after 20 attempts.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})