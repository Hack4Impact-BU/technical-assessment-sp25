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

const PORT = process.env.PORT || 4000;

const GENIUS_API_TOKEN = process.env.CLIENT_ACCESS_TOKEN;

const fetchRandomSongs = async () => {
    console.log("function executed");
    try {
        const randomIds = [23,3,4]; //change to real IDs (ids that can be chosen from);
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

        const db = await getDataBase('comment_section');
        const collection = db.collection('songs');
        await collection.updateOne(
            { type: 'dailySongs' },
            { $set: { songs: songData, updateAt: new Date() } },
            { upsert: true }
        );

        console.log('Songs updated successfully:', songData);
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
};

// cron.schedule('* * * * *', fetchRandomSongs, {
//     timezone: 'America/New_York',
// });

fetchRandomSongs();

app.get('/api/songs', async (req, res) => {
    try {
        const db = await getDataBase('comment_section');
        const collection = db.collection('songs');
        const songData = await collection.findOne({ type: 'dailySongs' });
        console.log('Song Data:', songData);
        res.status(200).json(songData?.songs || []);
    } catch (error) {
        console.error('Error fetching songs from database:', error);
        res.status(500).send('Server error');
    }
});

app.post('/api/comments', async (req,res) => {
    try {
        console.log('Request body: ', req.body);

        const db = await getDataBase('comment_section')
        console.log("Database connected successfully");
        const collection = db.collection('comments');

        const { songChoice, username, comment } = req.body;

        if (!songChoice || !username || !comment) {
            return res.status(400).send('All fields are required');
        }

        const newComment = {
            songChoice,
            username,
            comment,
            date: new Date(),  //change to current date
        };

        await collection.insertOne(newComment);
        res.status(201).send('Comment added successfully');
    } catch (error) {
        console.error('Error adding comment', error);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
