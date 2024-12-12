import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cron from 'node-cron';

import { getDataBase } from './mongodb.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4003;
const GENIUS_API_TOKEN = process.env.CLIENT_ACCESS_TOKEN;


const fetchRandomSongs = async () => {
    console.log("fetch random songs function executed");
    try {
        const id1 = Math.floor(Math.random() * 99999) + 1;
        const id2 = Math.floor(Math.random() * 99999) + 1;
        const id3 = Math.floor(Math.random() * 99999) + 1;

        const randomIds = [id1, id2, id3];
        const songData = await Promise.all(
            randomIds.map(async (id) => {
                const response = await fetch (`https://api.genius.com/songs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${GENIUS_API_TOKEN}`,
                    }
                });

                if (!response.ok) {
                    console.log("Re-fetching songs");
                    fetchRandomSongs();
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

        console.log(today);

        await collection.insertOne({
            type: 'dailySongs',
            songs: songData,
            date: today,
        });

        console.log('Songs updated successfully:', songData);
        
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
};

cron.schedule('0 0 * * *', fetchRandomSongs, {
    timezone: 'America/New_York',
});

app.get('/api/songs/:date', async (req, res) => {
    try {
        const { date } = req.params;

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

app.post('/api/commentSection', async (req,res) => {
    try {
        const { date } = req.body;

        const db = await getDataBase('comment_section');
        const collection = db.collection('songData');

        const data = await collection.find({ date }).toArray();

        if(!data) {
            return res.status(404).json({ songs: { song1: [], song2: [], song3: [] } });
        }

        try {
            const clonedData = JSON.parse(JSON.stringify(data));
            // console.log(clonedData);
            res.status(200).json(clonedData);
        } catch (er) {
            console.error('Can\'t convert data to a JSON', er);
        }
    } catch (error) {
        console.error('Error fetching comments from database', error);
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
