import React from 'react';
import { Card, CardContent, Box, CardMedia, Typography } from '@mui/material';


function SongDisplay({}) { //SongDisplay function will take 3 props for the 3 songs that it displays
    return(
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                padding: '50px',
                justifyContent: 'space-around',
            }}>
                <Card raised sx={{ width: 400, height: 400, border:3, borderColor: '#AF9AB2', }}>
                    <CardMedia
                        component="img"
                        height="300"
                        image="https://preview.redd.it/kanye-west-graduation-3840x2160-v0-kjektcn4myv91.png?width=640&crop=smart&auto=webp&s=fa4b58c81acb3ec38c640cca6ef11d66d01c3cf3"
                        alt="Graduation"
                    />
                    <CardContent>
                        <Typography align="center" variant="h4">Drunk and Hot Girls</Typography>
                        <Typography align="center" variant="body1">Kanye West</Typography>
                    </CardContent>
                        
                </Card>

                <Card raised sx={{ width: 400, height: 400, border:3, borderColor: '#AF9AB2', }}>
                    <CardMedia
                        component="img"
                        height="300"
                        image="https://thedmonline.com/wp-content/uploads/2022/11/Her_Loss.jpg"
                        alt="Her Loss"
                    />
                    <CardContent>
                        <Typography align="center" variant="h4">Middle of the Ocean</Typography>
                        <Typography align="center" variant="body1">Drake</Typography>
                    </CardContent>
                        
                </Card>

                <Card raised sx={{ width: 400, height: 400, border:3, borderColor: '#AF9AB2', }}>
                    <CardMedia
                        component="img"
                        height="300"
                        image="https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png"
                        alt="To Pimp a Butterfly"
                    />
                    <CardContent>
                        <Typography align="center" variant="h4">Alright</Typography>
                        <Typography align="center" variant="body1">Kendrick Lamar</Typography>
                    </CardContent>
                        
                </Card>
            </Box>
        </>
    )
}

export default SongDisplay;