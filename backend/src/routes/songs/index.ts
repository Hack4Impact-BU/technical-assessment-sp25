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

/**
 * POST /api/songs/vote
 * @summary Adds a vote to a song in the database
 * @tags comments
 * @param {number} body.song_id.required - The song_id of the song to vote on
 * @return {object} - 200 - The vote that was added
 * @return {Error} 400 - Bad request
 * @return {Error} 500 - Internal server error
 */
songRouter.post('/vote', async (req: Request, res: Response) => {
    const { id } = req.body;
    if ( !id || typeof id !== 'number') {
        return res.status(400).json({ error: 'Missing required parameter(s): song_id' });
    }
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const checkIfSongExistsQuery = `SELECT * FROM songs WHERE id = $1`;
        const checkIfSongExistsResponse = await dbClient.query(checkIfSongExistsQuery, [id]);
        if (checkIfSongExistsResponse.rows.length === 0) {
            return res.status(404).json({ error: 'Song not found' });
        } 
        const addVoteQuery = `UPDATE songs SET num_votes = num_votes + 1 WHERE id = $1 RETURNING *`;
        const addVoteResponse = await dbClient.query(addVoteQuery, [id]);
        const updatedSong:Song = addVoteResponse.rows[0];
        return res.status(200).json(updatedSong);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/songs/top-voted
 * @summary Fetches the top-voted song for a given date
 * @tags song
 * @param {string} query.date.required - The date to fetch the top-voted song for
 * @return {Song} 200 - The top-voted song for the given date
 * @return {Error} 400 - Bad request
 * @return {Error} 500 - Internal server error
 */
songRouter.get('/top-voted', async (req: Request, res: Response) => {
    const { date } = req.query;
    if (!date || typeof date !== 'string') {
        return res.status(400).json({ error: 'Missing required parameter: date' });
    }
    try {
        const query = `SELECT * FROM songs WHERE featured_date = $1 ORDER BY num_votes DESC LIMIT 1`;
        const response = await dbClient.query(query, [date]);
        const topVotedSong: Song = response.rows[0];
        return res.status(200).json(topVotedSong);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = songRouter;
