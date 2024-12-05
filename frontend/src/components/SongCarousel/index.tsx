import SongCard from "../SongCard";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import Skeleton from '@mui/material/Skeleton';
import { fetchSongsByDate, fetchTopSongByDate } from "../../api/songs";
import { useQuery } from "@tanstack/react-query";
import { Song } from "../../types/songs";

type SongCarouselProps = {
    currentDate: Date;
};

export default function SongCarousel({ currentDate }: SongCarouselProps) {
    const { data: songs, isLoading, error } = useQuery<Song[], Error>({
        queryKey: ['songs', currentDate],
        queryFn: fetchSongsByDate
    });

    const { data: topSong } = useQuery<Song, Error>({
        queryKey: ['topSong', currentDate],
        queryFn: fetchTopSongByDate
    });
    
    if (isLoading) {
        return (
            <Box className='flex w-full justify-evenly'>
                {
                    Array(3).fill(null).map((_, index) => (
                        <Skeleton key={index} variant="rectangular" width={240} height={240} />
                    ))
                }
            </Box>
        )
    }

    else if (error) {
        return (
            <Box className='flex flex-col w-full items-center'>
                <WarningAmberOutlined />
                <Typography variant="h6">
                    An error occurred while fetching today's songs. Please try again later.
                </Typography>
            </Box>
        )
    }

    else {
            return (
                <Box className='flex w-full gap-4 lg:gap-8 justify-evenly'>
                    { 
                        songs?.length === 0 ? 
                        <Typography variant="h6">
                            No songs found for today.
                        </Typography> 
                        : songs?.map((song) => (
                            <SongCard key={song.id} song={song} isTopSong={song.id === topSong?.id} />
                        ))
                    }
                </Box>
        )
    }
}