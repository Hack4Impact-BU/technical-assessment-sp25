import useDate from '../../hooks/useDate';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SongCarousel from '../../components/SongCarousel';
import CommentSection from '../../components/CommentSection';
import DateSwitch from '../../components/DateSwitch';

export default function Home() {
    const { currentDate, incrementDate, decrementDate, incrementDisabled } = useDate();
    return (
        <Container
            className='w-4/5'
        >
            <Typography 
                variant='h1'
                className='text-center font-semibold tracking-wider'
                color='primary'
            >
                Encore
            </Typography>
            <div
                className='relative h-10 md:h-16'
            >
                <DateSwitch currentDate={currentDate} incrementDate={incrementDate} decrementDate={decrementDate} incrementDisabled={incrementDisabled} />
            </div>
            <SongCarousel currentDate={currentDate} />
            <CommentSection currentDate={currentDate} />
        </Container>
    )
}