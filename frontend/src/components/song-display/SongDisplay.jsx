import React, {useState, useEffect} from 'react';
import { Card, CardContent, Box, CardMedia, Typography } from '@mui/material';


function SongDisplay() {
    const [songs, setSongs] = useState({ song1: {}, song2: {}, song3: {} });

    const fetchSongs = async () => {
        const today = new Date().toISOString().split('T')[0];
        try {
            const response = await fetch(`http://localhost:4000/api/songs/${today}`);
            const data = await response.json();
            console.log('Fetched songs', data);
            setSongs(data);
        } catch {
            console.error('Error fetching songs', error);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);


    return (
    
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            padding: '50px',
            justifyContent: 'space-around',
        }}>
            {Object.entries(songs).map(([key, song]) => (
                <Card
                    key={key}
                    raised
                    sx={{ width: 400, height: 400, border:3, borderColor: '#AF9AB2',}}
                >
                    <CardMedia
                        component="img"
                        height="300"
                        image={song.image}
                        alt={song.title}
                        sx={{
                            height: '75%',
                            width: '100%',
                        }}
                    />
                    <CardContent>
                        <Typography align='center' variant='h4'>
                            {song.title || `Song ${key.slice(-1)}`}
                        </Typography>
                        <Typography align='center' variant='body1'>
                            {song.artist || 'Unknown Artist'}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

export default SongDisplay;