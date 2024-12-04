const axios = require('axios');
require('dotenv').config();
const GENIUS_ENDPOINT: string = 'https://api.genius.com';
const GENIUS_ACCESS_TOKEN: string = process.env.GENIUS_ACCESS_TOKEN;
import { Song } from "./types";

const generateRandomQuery: () => string = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const length = Math.floor(Math.random() * 6) + 1;
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const fetchRandomSongs: () => Promise<Song[]> = async () => {
    const query = generateRandomQuery();
    const response = await axios.get(`${GENIUS_ENDPOINT}/search`, {
        headers: {
            Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`
        },
        params: {
            q: query
        }
    });

    const songs: Song[] = response.data.response.hits.slice(0, 3).map((song) => {
        return {
            id: song.result.id,
            title: song.result.title ?? 'No Title',
            artist: song.result.primary_artist.name ?? 'Unknown',
            thumbnail_url: song.result.song_art_image_thumbnail_url ?? '',
            genius_url: song.result.url ?? ''
        }
    })

    return songs;
}

module.exports = {
    fetchRandomSongs
}