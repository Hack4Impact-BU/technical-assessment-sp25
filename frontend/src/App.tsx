import React, { useEffect, useState } from 'react';
import TestSupabase from './components/TestSupabase';
import './App.css';
import axios from 'axios';
import { Container, Grid, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import SongCard from './components/SongCard';

interface Song {
  id: number;
  title: string;
  artist: string;
  coverArt: string;
  url: string;
}

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Ensure the API URL is correct
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

        const response = await axios.get<Song[]>(`${apiUrl}/random-songs`);

        // Validate the response structure
        if (response.status === 200 && Array.isArray(response.data)) {
          setSongs(response.data);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err: any) {
        setError('Failed to fetch songs. Please try again later.');
        console.error('Error fetching songs:', err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return (
    <Container sx={{ paddingTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Random Genius Songs
        <TestSupabase />
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {songs.map((song) => (
            <Grid item key={song.id} xs={12} sm={6} md={4}>
              <SongCard song={song} />
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
