import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

dotenv.config()// Loads the variables from .env into process.env

//allows to define routes and decide how the server should respond to different types of requests
const app = express()

//enable cross-origin requests to communicate with frontend
app.use(cors()) 

//parse incoming request bodies into JSON
app.use(bodyParser.json())

const mongourl = process.env.MONGO_URL
const mongoclient = new MongoClient(mongourl, {})

mongoclient.connect().then(() => {
    console.log("Connected to MongoDB")
})

const PORT = process.env.PORT || 4000;
const GENIUS_ACCESS_TOKEN = process.env.GENIUS_CLIENT_ACCESS_TOKEN;

async function fetchSongById(songId) {

    //else fetching new songs

    const url = `https://api.genius.com/songs/${songId}`;
    const headers = {
        Authorization: `Bearer ${process.env.GENIUS_CLIENT_ACCESS_TOKEN}`,
    };

    try {
        //fetch song
        const response = await fetch(url, { headers });
        const data = await response.json();

        if (response.ok) {

            return data.response.song;
        }
        return null; // Return null if the song doesn't exist
    } catch(e) {
        responseMessage = 'Couldnt fetch a song'
    }
}

// POST endpoint to get a random song in frontend
app.post('/music', async (req, res) => {

    const { date } = req.body;//today's date by defult in music.jsx

    const randomSongs = [];

    const songsCollection = await mongoclient.db('music-board').collection('songs');

    //let today_date = new Date().toLocaleDateString();
    
    // If random 3 songs of { date: today_date } exist and return to those
    const songs_of_the_day = await songsCollection.findOne({ date: date });
    if (songs_of_the_day) {
        for(let i=0; i<3; i++)
        {
            let song = songs_of_the_day.songs[i]
            randomSongs.push({
                full_title: song.full_title,
                title: song.title,
                image_url: song.image_url,
                image_thumbnail_url: song.image_thumbnail_url,
                artist: song.artist,
                genius_url: song.genius_url,
            });
        }
    }
    else{
        for (let i = 0; i < 3; i++) {
            let song = null;
    
            while (!song) {
                //generating 6 digit id
                const randomId = Math.floor(100000 + Math.random() * 900000); 
                //attempt to fetch song
                song = await fetchSongById(randomId);
            }
    
            //if song is found, send JSON response
            if (song) {
                randomSongs.push({
                    id: song.id,
                    full_title: song.full_title,
                    title: song.title,
                    image_url: song.song_art_image_url,
                    image_thumbnail_url: song.song_art_image_thumbnail_url,
                    artist: song.artist_names,
                    genius_url: song.url,
                });
            } else {
                res.status(404).json({ error: 'Something went wrong, could not find a valid song' });
            }
        }

        // Save songs to db
        await mongoclient.db('music-board').collection('songs').insertOne({ date: date, songs: randomSongs });
    }

    //sending randomSongs as response
    res.json(randomSongs);

});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


app.post('/add', async (req, res) => {
    try {
        const new_post = req.body;

        // check if name and comment are provided
        if (!new_post.name || !new_post.comment) {
            res.status(400).json({ message: 'Bad Request' })
            return
        }

        const songsCollection = mongoclient.db('music-board').collection('songs');

        const today = new Date().toLocaleDateString();

        // Update the db
        await songsCollection.updateOne({ date: today }, { $push: { comments: new_post } });
        res.status(201).json({ message: 'Success' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error: failed to add comment' })
    }
});


// POST endpoint to get comments
app.post('/board', async (req, res) => {

    const { date } = req.body;//today's date by defult in board.jsx

    let community_comments = [];

    try{

    const songsCollection = await mongoclient.db('music-board').collection('songs');

    // If random 3 songs of today exist and return to those
    const songs_of_the_day = await songsCollection.findOne({ date: date });
    if (songs_of_the_day && songs_of_the_day.comments && songs_of_the_day.comments.length > 0) {
        for(let i=0; i<songs_of_the_day.comments.length; i++)
        {
            let c = songs_of_the_day.comments[i]
                community_comments.push({
                name: c.name,
                comment: c.comment,
            });
        }
    }
    

    if (!songs_of_the_day.comments || !songs_of_the_day.comments || community_comments.length === 0) {
        res.status(200).json({ message: 'No comments available for this day.' });
    } 

    //sending community_comments as response
    res.json(community_comments);
    } catch(e){
        console.error("Something went wrong")
    }

});