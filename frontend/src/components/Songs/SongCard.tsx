// src/components/Songs/SongCard.tsx

import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import { Song } from '../../types/Song';
import VoteButton from '../Voting/VoteButton';

interface SongCardProps {
    song: Song;
    onVote: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onVote }) => {
    return (
        <Card sx={{ display: 'flex', marginBottom: 2 }}>
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
                    {song.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                    {song.artist} - {song.album} 
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                    Votes: {song.num_votes}
                </Typography>
                <VoteButton songId={song.id} onVoteSuccess={onVote} />
            </CardContent>
        </Card>
    );
};

export default SongCard;
