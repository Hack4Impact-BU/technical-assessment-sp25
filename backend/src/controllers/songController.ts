
import { Request, Response, NextFunction } from 'express';
import { fetchSongById, saveDailySongs, getDailySongs } from '../services/songService';
import { Song } from '../types';
import logger from '../utils/logger';

//get songs very date or if songs already exist in supabase return them
export const getRandomSongs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const date = req.query.date as string;
  if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Missing required parameter: date' });
      return;
  }


    try {
        const existingSongs = await getDailySongs(new Date(date));
        if (existingSongs && existingSongs.length > 0) {
            res.status(200).json({ data: existingSongs });
            return;
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

            const song = await fetchSongById(randomId);
            if (song) {
                songs.push({
                    ...song,
                    featured_date: date, 
                });
            } else {
                retries++;
            }
        }

        if (songs.length < desiredCount) {
            res.status(500).json({ error: 'Failed to fetch enough songs' });
            return;
        }

        // Save songs to database 
        await saveDailySongs(songs, date); 

        // Return data 
        res.status(200).json({ data: songs });
    } catch (error) {
        logger.error(`Error in getRandomSongs: ${error}`);
        res.status(500).json({ error: 'An error occurred while fetching songs' });
    }
};
