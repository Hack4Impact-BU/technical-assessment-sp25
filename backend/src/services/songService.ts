// src/services/songService.ts

import axios from 'axios';
import { supabase } from '../supabaseClient';
import { Song } from '../types/index';
import { config } from '../config';
import logger from '../utils/logger';

// Fetches a song by its ID from the Genius API.
export const fetchSongById = async (id: number): Promise<Song | null> => {
    const token = config.geniusAccessToken;

    try {
        // Send a request to the Genius API to retrieve song details
        const response = await axios.get<{ response: { song: any } }>(
            `https://api.genius.com/songs/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const songData = response.data.response.song;

        if (!songData) {
            logger.warn(`No song data found for ID ${id}`);
            return null;
        }

        // Map the API response to the Song interface
        const song: Song = {
            id: songData.id,
            title: songData.title || 'No Title',
            artist: songData.primary_artist?.name || 'Unknown Artist',
            album: songData.album?.name || 'Unknown Album',
            featured_date: new Date().toISOString().split('T')[0], // Today's date
            thumbnail_url: songData.song_art_image_thumbnail_url || null,
            genius_url: songData.url || '',
            num_votes: 0, // Default to 0 votes
        };

        return song;
    } catch (error: any) {
        logger.error(`Error fetching song with ID ${id}: ${error.message}`);
        return null;
    }
};

// Saves daily songs to the database or updates them if they already exist
export const saveDailySongs = async (songs: Song[], date: string): Promise<Song[]> => {
    logger.info(`Saving ${songs.length} songs for date: ${date}`);

    const { data, error } = await supabase
        .from('songs')
        .upsert(
            songs.map(song => ({
                id: song.id,
                title: song.title,
                artist: song.artist,
                album: song.album,
                featured_date: date,
                thumbnail_url: song.thumbnail_url,
                genius_url: song.genius_url,
                num_votes: song.num_votes,
            })),
            { onConflict: 'id' } // Prevent duplicates by updating existing records
        )
        .select();

    if (error) {
        logger.error(`Failed to save daily songs: ${error.message}`);
        throw new Error(`Failed to save daily songs: ${error.message}`);
    }

    logger.info(`Successfully saved songs for date: ${date}`);
    return data as Song[];
};

// Retrieves songs for a specific date from the database
export const getDailySongs = async (date?: Date): Promise<Song[]> => {
    const targetDate = (date || new Date()).toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('featured_date', targetDate)
        .order('id', { ascending: true });

    if (error) {
        logger.error(`Supabase Error: ${error.message}`);
        throw new Error(`Failed to retrieve daily songs: ${error.message}`);
    }

    if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received from Supabase');
    }

    return data as Song[];
};

// Fetches a specified number of random songs from the Genius API
export const fetchRandomSongs = async (count: number = 3): Promise<Song[]> => {
    const GENIUS_ACCESS_TOKEN = config.geniusAccessToken;

    if (!GENIUS_ACCESS_TOKEN) {
        throw new Error('GENIUS_ACCESS_TOKEN is not defined in environment variables');
    }

    const songs: Song[] = [];
    const uniqueIds = new Set<number>();
    const maxId = 300000; // Limit for random song ID generation
    const maxRetries = 50;
    let retries = 0;

    while (songs.length < count && retries < maxRetries) {
        const randomId = Math.floor(Math.random() * maxId);

        if (uniqueIds.has(randomId)) {
            retries++;
            continue;
        }

        uniqueIds.add(randomId);

        try {
            // Fetch song data from the Genius API
            const response = await axios.get<{ response: { song: any } }>(
                `https://api.genius.com/songs/${randomId}`,
                {
                    headers: {
                        Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
                    },
                }
            );

            const songData = response.data.response.song;

            if (songData) {
                const song: Song = {
                    id: songData.id,
                    title: songData.title || 'No Title',
                    artist: songData.artist || 'Unknown Artist',
                    album: songData.album || 'Unknown Album',
                    featured_date: new Date().toISOString().split('T')[0], // Today's date
                    thumbnail_url: songData.song_art_image_thumbnail_url || null,
                    genius_url: songData.url || '',
                    num_votes: 0, // Default to 0 votes
                };

                songs.push(song);
            } else {
                retries++;
            }
        } catch (error: any) {
            logger.error(`Error fetching song with ID ${randomId}: ${error.message}`);
            retries++;
        }
    }

    if (songs.length < count) {
        throw new Error('Failed to fetch enough songs from Genius API');
    }

    return songs;
};
