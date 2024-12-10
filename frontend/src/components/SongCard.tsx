// src/components/SongCard.tsx

import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';

interface Song {
  id: number;
  title: string;
  artist: string;
  coverArt: string;
  url: string;
}

interface SongCardProps {
  song: Song;
}

const SongCard: React.FC<SongCardProps> = ({ song }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea href={song.url} target="_blank">
        <CardMedia
          component="img"
          height="140"
          image={song.coverArt}
          alt={`${song.title} cover art`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {song.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Artist: {song.artist}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SongCard;