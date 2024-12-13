// src/utils.ts

import { Song } from './types';
import axios from 'axios';
import dotenv from 'dotenv';
import { supabase } from './supabaseClient';

dotenv.config();

interface GeniusSongResponse {
    response: {
        song: {
            id: number;
            title: string;
            primary_artist: { name: string };
            url: string;
            song_art_image_thumbnail_url: string;
            // Include 'album' if it's part of the API response
            album?: string;
        };
    };
}
/**
 * Fetches random songs from the Genius API.
 * @returns {Promise<Song[]>} An array of Song objects.
 */
export const fetchRandomSongs = async (): Promise<Song[]> => {
    const GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;
    if (!GENIUS_ACCESS_TOKEN) {
        throw new Error('GENIUS_ACCESS_TOKEN is not defined in environment variables');
    }

    const desiredCount = 3;
    const songs: Song[] = [];
    const uniqueIds = new Set<number>();
    const maxId = 300000;
    const maxRetries = 50;
    let retries = 0;

    while (songs.length < desiredCount && retries < maxRetries) {
        const randomId = Math.floor(Math.random() * maxId);

        if (uniqueIds.has(randomId)) {
            retries++;
            continue;
        }

        uniqueIds.add(randomId);

        try {
            const response = await axios.get<GeniusSongResponse>(
                `https://api.genius.com/songs/${randomId}`,
                {
                    headers: {
                        Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
                    },
                }
            );

            const songData = response.data.response.song;
            if (songData) {
                songs.push({
                    id: songData.id,
                    title: songData.title || 'No Title',
                    artist: songData.primary_artist.name || 'Unknown',
                    album: songData.album || 'Unknown Album', // Handle missing album
                    thumbnail_url: songData.song_art_image_thumbnail_url || null,
                    genius_url: songData.url,
                    featured_date: new Date().toISOString().split('T')[0],
                    num_votes: 0
                });
            } else {
                retries++;
            }
        } catch (error) {
            console.error(`Error fetching song with ID ${randomId}:`, error);
            retries++;
        }
    }

    if (songs.length < desiredCount) {
        throw new Error('Failed to fetch enough songs from Genius API');
    }

    return songs;
};
