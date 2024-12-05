import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import { Song } from '../../types/songs';

type SongCardProps = {
  song: Song;
  isTopSong: boolean;
};

export default function SongCard ({ song, isTopSong }: SongCardProps ) {
    return (
        <Card
            variant={isTopSong ? 'elevation' : 'outlined'}
            sx={{
                bgcolor: isTopSong ? 'secondary.dark' : 'background.paper',
                color: isTopSong ? 'secondary.contrastText' : 'text.primary',
            }}
        >
            <CardMedia
                component="img"
                className='h-52 md:h-60'
                image={song.thumbnail_url || 'https://via.placeholder.com/300'}
                alt={song.title}
            />
            <CardContent>
                <Typography 
                    variant="h5" 
                    component="div"
                    color={isTopSong ? 'secondary.contrastText' : 'text.primary'}
                >
                    <Link 
                        href={song.genius_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className='hover:underline text-inherit no-underline'
                    >
                        {song.title}
                    </Link>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {song.artist}
                </Typography>
            </CardContent>
        </Card>
    )
}