import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { getDataBase } from './mongodb.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4003;
const GENIUS_API_TOKEN = process.env.CLIENT_ACCESS_TOKEN;


const fetchRandomSongs = async () => {
    console.log("function executed");
    try {
        const randomIds = [27,32452,12312]; //change to real IDs (ids that can be chosen from);
        const songData = await Promise.all(
            randomIds.map(async (id) => {
                const response = await fetch (`https://api.genius.com/songs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${GENIUS_API_TOKEN}`,
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch song with ID ${id}: ${response.statusText}`);
                }

                const data = await response.json();
                return {
                    title: data.response.song.title,
                    artist: data.response.song.primary_artist.name,
                    image: data.response.song.song_art_image_url,
                };
            })
        );

        const today = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date());

        const db = await getDataBase('comment_section');
        const collection = db.collection('songs');

        await collection.updateOne(
            { type: 'dailySongs' },
            { $set: { songs: songData, date: today } },
            { upsert: true }
        );

        console.log('Songs updated successfully:', songData);
        
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
};

// cron.schedule('0 0 * * *', fetchRandomSongs, {
//     timezone: 'America/New_York',
// });

fetchRandomSongs();

app.get('/api/songs/:date', async (req, res) => {
    try {
        const { date } = req.params;
        console.log(date);
        const db = await getDataBase('comment_section');
        const collection = db.collection('songs');
        const songData = await collection.findOne({ date });
        
        res.status(200).json(songData?.songs || []);
    } catch (error) {
        console.error('Error fetching songs from database:', error);
        res.status(500).send('Server error');
    }
});

app.post('/api/comments', async (req,res) => {
    try {
        const { username, comment, songChoice, date } = req.body;

        if (!songChoice || !username || !comment || !date) {
            return res.status(400).send('All fields are required');
        }

        const db = await getDataBase('comment_section');
        const collection = db.collection('songData');

        const newComment = { username, comment };

        await collection.updateOne(
            { date },
            {
                $setOnInsert: {
                    date,
                    songs: {
                        song1: { comments: [] },
                        song2: { comments: [] },
                        song3: { comments: [] },
                    },
                },
            },
            { upsert: true }
        );

        const updateResult = await collection.updateOne(
            { date },
            {
                $push: { [`songs.${songChoice}.comments`]: newComment },
            }
        )

        res.status(201).send('Comment added successfully :)');
    } catch (error) {
        console.error('Error adding comment', error);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
