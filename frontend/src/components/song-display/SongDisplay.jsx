import React, {useState, useEffect} from 'react';
import { Card, CardContent, Box, CardMedia, Typography } from '@mui/material';


function SongDisplay() {
    const [songs, setSongs] = useState([]);

    const fetchSongs = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/songs');
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
            {songs.map((song,index) => (
                <Card
                    key={index}
                    raised
                    sx={{ width: 400, height: 400, border:3, borderColor: '#AF9AB2'}}
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
                            {song.title}
                        </Typography>
                        <Typography align='center' variant='body1'>
                            {song.artist}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

export default SongDisplay;