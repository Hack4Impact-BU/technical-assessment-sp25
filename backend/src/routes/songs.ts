// src/routes/songs.ts

import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../supabaseClient';
import { Song } from '../types/index';
import { fetchRandomSongs } from '../services/songService';
import { asyncHandler } from '../utils/asyncHandler';
import { getRandomSongs } from '../controllers/songController';
import logger from '../utils/logger';

const songRouter = Router();

/**
 * GET /api/songs
 * @summary Fetches 3 daily songs from the database for a given date. If no songs are found, fetches 3 random songs from the Genius API and adds them to the database.
 * @tags song
 * @param {string} query.date.required - The date to fetch songs for (YYYY-MM-DD)
 * @return {object} 200 - An object containing an array of songs for the given date
 * @return {object} 400 - Bad request
 * @return {object} 500 - Internal server error
 */
songRouter.get('/', asyncHandler(getRandomSongs));

/**
 * POST /api/songs/vote
 * @summary Adds a vote to a song in the database
 * @tags song
 * @param {number} body.song_id.required - The song_id of the song to vote on
 * @return {object} 200 - The updated song
 * @return {object} 400 - Bad request
 * @return {object} 500 - Internal server error
 */
songRouter.post('/vote', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { song_id } = req.body;
    if (!song_id || typeof song_id !== 'number') {
        res.status(400).json({ error: 'Missing required parameter(s): song_id' });
        return;
    }

    try {
        // Check if song exists
        const { data: song, error: songError } = await supabase
            .from('songs')
            .select('*')
            .eq('id', song_id)
            .single();

        if (songError || !song) {
            res.status(404).json({ error: 'Song not found' });
            return;
        }

        // Update vote count
        const { data: updatedSong, error: updateError } = await supabase
            .from('songs')
            .update({ num_votes: (song.num_votes || 0) + 1 })
            .eq('id', song_id)
            .select('*')
            .single();

        if (updateError || !updatedSong) {
            logger.error(`Failed to update vote count: ${updateError}`);
            throw updateError || new Error('Failed to update vote count');
        }

        res.status(200).json({ data: updatedSong });
    } catch (e) {
        logger.error(`Error in voting song: ${e}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// src/services/songService.ts

/**
 * Saves daily songs to the Supabase database by upserting songs and updating their featured_date.
 * @param songs - Array of Song objects to save.
 * @param date - The date to associate with the songs.
 * @returns The upserted data from Supabase.
 */
export const saveDailySongs = async (songs: Song[], date: string): Promise<Song[]> => {
    const selectedDate = date; // Already in 'YYYY-MM-DD' format

    const { data, error } = await supabase
        .from('songs')
        .upsert(
            songs.map(song => ({
                id: song.id,
                title: song.title,
                artist: song.artist,
                album: song.album,
                featured_date: selectedDate,
                thumbnail_url: song.thumbnail_url,
                genius_url: song.genius_url,
                num_votes: song.num_votes,
            })),
            { onConflict: 'id' }
        )
        .select();

    if (error) {
        logger.error(`Failed to save daily songs: ${error.message}`);
        throw new Error(`Failed to save daily songs: ${error.message}`);
    }

    return data as Song[];
};

/**
 * GET /api/songs/top-voted
 * @summary Fetches the top-voted song for a given date
 * @tags song
 * @param {string} query.date.required - The date to fetch the top-voted song for (YYYY-MM-DD)
 * @return {object} 200 - An object containing the top-voted song for the given date
 * @return {object} 400 - Bad request
 * @return {object} 500 - Internal server error
 */
songRouter.get('/top-voted', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const date = req.query.date as string;
    if (!date || typeof date !== 'string') {
        res.status(400).json({ error: 'Missing required parameter: date' });
        return;
    }

    try {
        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .eq('featured_date', date)
            .order('num_votes', { ascending: false })
            .limit(1);

        if (error) {
            logger.error(`Supabase Error: ${error.message}`);
            throw error;
        }

        const topVotedSong: Song | null = data.length > 0 ? (data[0] as Song) : null;

        if (topVotedSong) {
            res.status(200).json({ data: topVotedSong });
        } else {
            res.status(404).json({ error: 'No songs found for the given date' });
        }
    } catch (error) {
        logger.error(`Error in fetching top-voted song: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}));

export default songRouter;
