import axios from 'axios';
import { QueryKey } from '@tanstack/react-query';
import { Song } from '../types/songs';

const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * @summary Fetch songs by date. If no date is provided, fetches songs for today. 
 * @param date date to fetch songs for, defaults to today
 * @returns {Song[]} array of songs. Empty array if no songs are found. 
 * @throws {Error} if request fails
 */
export const fetchSongsByDate: ({ queryKey }: { queryKey: QueryKey}) => Promise<Song[]> = async ({ queryKey }) => {
    const [_ , date] = queryKey;
    if (!(date instanceof Date)) {
        throw new Error('Invalid date');
    }
    const params = {
        date: date.toISOString().split('T')[0],
    }
    const response = await axios.get(`${API_URL}/songs`, { params });
    if (response.status !== 200) {
        throw new Error('Failed to fetch songs');
    } else {
        return response.data;
    }
};

/**
 * @summary Adds a vote to a song
 * @param id id of the song to vote for
 * @returns {Song} the song with the updated vote count
 * @throws {Error} if request fails or song is not found
 */
export const voteForSong: ({ id }: { id: number }) => Promise<Song> = async ({ id }) => {
    const body = { id };
    const response = await axios.post(`${API_URL}/songs/vote`, body);
    if (response.status !== 200) {
        throw new Error('Failed to vote for song');
    } else {
        return response.data;
    }
}

/**
 * @summary Fetches the song with the most votes for a given date
 * @param {Date} date date to fetch the top song for
 * @returns {Song} the song with the most votes for the given date
 * @throws {Error} if request fails or no song is found
 */
export const fetchTopSongByDate: ({ queryKey }: { queryKey: QueryKey }) => Promise<Song> = async ({ queryKey }) => {
    const [_ , date] = queryKey;
    if (!(date instanceof Date)) {
        throw new Error('Invalid date');
    }
    const params = {
        date: date.toISOString().split('T')[0],
    }
    const response = await axios.get(`${API_URL}/songs/top-voted`, { params });
    if (response.status !== 200) {
        throw new Error('Failed to fetch top song');
    } else {
        return response.data;
    }
};