// src/components/Songs/SongsList.tsx

import React from 'react';
import { Song } from '../../types/Song';
import SongCard from './SongCard';
import { Typography } from '@mui/material';

interface SongsListProps {
    songs: Song[];
    onVote: () => void;
}

const SongsList: React.FC<SongsListProps> = ({ songs, onVote }) => {
    if (songs.length === 0) {
        return <Typography>No songs found for this date.</Typography>;
    }

    return (
        <div>
            {songs.slice(0, 3).map((song) => ( // Limit to first 3 songs
                <SongCard key={song.id} song={song} onVote={onVote} />
            ))}
        </div>
    );
};

export default SongsList;

