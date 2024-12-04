import { Request, Response } from 'express';
import { Song } from './types';
import { delimiter } from 'path';
const { fetchRandomSongs } = require('./util');
const songRouter = require('express').Router();
require('dotenv').config();
const dbClient = require('../../db');


/**
 * GET /api/songs
 * @summary Fetches 3 daily songs from the database for a given date. If no songs are found, fetches 3 random songs from the Genius API and adds them to the database.
 * @tags song
 * @param {string} query.date.required - The date to fetch songs for
 * @return {Array<Song>} 200 - An array of songs for the given date.
 * @return {Error} 400 - Bad request
 * @return {Error} 404 - No songs found for the given date
 * @return {Error} 500 - Internal server error
 */
songRouter.get('/', async (req: Request, res: Response) => {
    const { date } = req.query;
    if (!date || typeof date !== 'string') {
        return res.status(400).json({ error: 'Missing required parameter: date' });
    }
    try {
        const query = `SELECT * FROM songs WHERE featured_date = $1`;
        const response = await dbClient.query(query, [date]);
        const dailySongs: Song[] = response.rows;
        if (dailySongs.length > 0) {
            return res.status(200).json(dailySongs);
        } else if (dailySongs.length === 0 && date === new Date().toISOString().split('T')[0]) {
            const newSongs: Song[] = await fetchRandomSongs();
            for (const song of newSongs) {
                const insertQuery = `INSERT INTO songs (id, title, artist, thumbnail_url, genius_url, featured_date) VALUES ($1, $2, $3, $4, $5, $6)`;
                await dbClient.query(insertQuery, [song.id, song.title, song.artist, song.thumbnail_url, song.genius_url, date]);
            }
            return res.status(200).json(newSongs);
        } else {
            return res.status(200).json([]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = songRouter;
