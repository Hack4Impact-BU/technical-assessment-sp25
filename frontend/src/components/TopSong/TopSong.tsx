// src/components/TopSong/TopSong.tsx

import React from 'react';
import { Song } from '../../types/Song';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

interface TopSongProps {
    song: Song | null;
}

const TopSong: React.FC<TopSongProps> = ({ song }) => {
    if (!song) {
        return <Typography>No top-voted song for this date.</Typography>;
    }

    return (
        <Card sx={{ display: 'flex', marginBottom: 4, backgroundColor: '#f5f5f5' }}>
            {song.thumbnail_url && (
                <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image={song.thumbnail_url}
                    alt={`${song.title} thumbnail`}
                />
            )}
            <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h5">
                    Top Voted: {song.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                    {song.artist} - {song.album} 
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                    Votes: {song.num_votes}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default TopSong;
