import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';

type DateSwitchProps = {
    currentDate: Date;
    incrementDate: () => void;
    decrementDate: () => void;
    incrementDisabled: boolean;
};

export default function DateSwitch({ currentDate, incrementDate, decrementDate, incrementDisabled }: DateSwitchProps) {
    return (
        <Box
            className='flex items-center justify-center gap-4 absolute top-4 right-4'
        >
            <IconButton 
                onClick={decrementDate}
            >
                <ArrowBack className='text-sm md:text-xl' />
            </IconButton>
            <Typography 
                color='textSecondary'
            >
                {currentDate.toDateString()}
            </Typography>
            <IconButton onClick={incrementDate} disabled={incrementDisabled}>
                <ArrowForward className='text-sm md:text-xl' />
            </IconButton>
        </Box>
    )
};