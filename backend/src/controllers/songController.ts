import { Request, Response } from 'express';
import { fetchSongById } from '../services/geniusService';

export const getRandomSongs = async (req: Request, res: Response): Promise<void> => {
  try {
    const desiredCount = 3;
    const songs: any[] = [];
    const uniqueIds = new Set<number>();
    const maxId = 300000; // Adjust based on your knowledge of valid song IDs
    const maxRetries = 50; // To prevent infinite loops
    let retries = 0;

    while (songs.length < desiredCount && retries < maxRetries) {
      const randomId = Math.floor(Math.random() * maxId);

      if (uniqueIds.has(randomId)) {
        retries++;
        continue; // Skip duplicate ID
      }

      uniqueIds.add(randomId);

      const song = await fetchSongById(randomId);
      if (song) {
        songs.push({
          id: song.id,
          title: song.title,
          artist: song.primary_artist.name,
          url: song.url,
          coverArt: song.song_art_image_thumbnail_url,
        });
      } else {
        retries++;
      }
    }

    if (songs.length < desiredCount) {
      res.status(500).json({ error: 'Failed to fetch enough songs. Please try again.' });
      return;
    }

    res.status(200).json(songs);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching random songs:', errorMessage);
    res.status(500).json({ error: 'An error occurred while fetching songs.' });
  }
};
