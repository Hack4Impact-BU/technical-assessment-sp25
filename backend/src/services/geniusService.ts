import axios from 'axios';

interface Song {
  id: number;
  title: string;
  primary_artist: { name: string };
  url: string;
  song_art_image_thumbnail_url: string;
}

export const fetchSongById = async (id: number): Promise<Song | null> => {
  const token = process.env.GENIUS_ACCESS_TOKEN;

  try {
    const response = await axios.get<{ response: { song: Song } }>(
      `https://api.genius.com/songs/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.response.song;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching song with ID ${id}:`, error.message);
    } else {
      console.error(`Error fetching song with ID ${id}:`, String(error));
    }
    return null;
  }
};
