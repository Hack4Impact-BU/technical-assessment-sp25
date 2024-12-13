// src/pages/Home.tsx

import React, { useState, useEffect } from 'react';
import { Box,Container, Typography, Divider } from '@mui/material';
import SongsList from '../components/Songs/SongsList';
import DatePicker from '../components/DatePicker/DatePicker';
import TopSong from '../components/TopSong/TopSong';
import CommentList from '../components/Comments/CommentList';
import AddCommentForm from '../components/Comments/AddCommentForm';
import api from '../services/api';
import { Song } from '../types/Song';
import { Comment } from '../types/Comment';
import { format } from 'date-fns';

const Home: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [songs, setSongs] = useState<Song[]>([]);
    const [topSong, setTopSong] = useState<Song | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingSongs, setLoadingSongs] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch songs when selectedDate changes
    useEffect(() => {
        const fetchSongs = async () => {
            if (!selectedDate) return;
            setLoadingSongs(true);
            setError(null);
            try {
                const formattedDate = format(selectedDate, 'yyyy-MM-dd');
                console.log('Fetching songs for date:', formattedDate); // Debug log
                const response = await api.get(`/songs?date=${formattedDate}`);
                const songsData: Song[] = response.data.data; // Explicitly define the type
        
                // Update state with songs for the selected date
                setSongs(songsData);
        
                // Find and set the top song
                if (songsData.length > 0) {
                    const sortedSongs = songsData.sort((a: Song, b: Song) => b.num_votes - a.num_votes);
                    setTopSong(sortedSongs[0]);
                } else {
                    setTopSong(null);
                }
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to fetch songs.');
            } finally {
                setLoadingSongs(false);
            }
        };
    
        fetchSongs();
    }, [selectedDate]);
    
    
useEffect(() => {
    const fetchComments = async () => {
      if (!selectedDate) return;
      setLoadingComments(true);
      setError(null);
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const response = await api.get(`/comments?date=${formattedDate}`);
        setComments(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch comments.');
      } finally {
        setLoadingComments(false);
      }
    };
  
    fetchComments();
  }, [selectedDate]);

    const handleVoteSuccess = () => {
        // Refresh songs to get updated vote counts
        if (!selectedDate) return;
        const fetchSongs = async () => {
            setLoadingSongs(true);
            setError(null);
            try {
                const formattedDate = format(selectedDate, 'yyyy-MM-dd');
                const response = await api.get(`/songs?date=${formattedDate}`);
                setSongs(response.data.data);
                // Determine the top song
                if (response.data.data.length > 0) {
                    const sortedSongs = response.data.data.sort((a: Song, b: Song) => b.num_votes - a.num_votes);
                    setTopSong(sortedSongs[0]);
                } else {
                    setTopSong(null);
                }
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to fetch songs.');
            } finally {
                setLoadingSongs(false);
            }
        };

        fetchSongs();
    };

    const handleCommentAdded = () => {
        // Refresh comments after adding a new comment
        if (!selectedDate) return;
        const fetchComments = async () => {
            setLoadingComments(true);
            setError(null);
            try {
                const formattedDate = format(selectedDate, 'yyyy-MM-dd');
                const response = await api.get(`/comments?date=${formattedDate}`);
                setComments(response.data.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to fetch comments.');
            } finally {
                setLoadingComments(false);
            }
        };

        fetchComments();
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh" // Full page height
            textAlign="center" // Center text alignment
        >
            <Container maxWidth="md" sx={{ marginTop: 4, marginBottom: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Genius Daily
                </Typography>
                <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
                <Divider sx={{ marginY: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Top Voted Song
                </Typography>
                <TopSong song={topSong} />
                <Divider sx={{ marginY: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Songs for {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                </Typography>
                {loadingSongs ? (
                    <Typography>Loading songs...</Typography>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <SongsList songs={songs} onVote={handleVoteSuccess} />
                )}
                <Divider sx={{ marginY: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Comments
                </Typography>
                {loadingComments ? (
                    <Typography>Loading comments...</Typography>
                ) : (
                    <CommentList comments={comments} />
                )}
                <AddCommentForm
                    onCommentAdded={handleCommentAdded}
                    selectedDate={selectedDate}
                />
            </Container>
        </Box>
    );
};

export default Home;