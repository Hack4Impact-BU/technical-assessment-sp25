import React from 'react';
import { IconButton, Box, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { format, addDays, subDays } from 'date-fns';

interface DatePickerProps {
    selectedDate: Date | null;
    onDateChange: (date: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange }) => {
    const handlePreviousDay = () => {
        if (selectedDate) {
            onDateChange(subDays(selectedDate, 1));
        }
    };

    const handleNextDay = () => {
        if (selectedDate) {
            onDateChange(addDays(selectedDate, 1));
        }
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ marginY: 2 }}>
            <IconButton onClick={handlePreviousDay} sx={{ color: 'white' }}> {/* Arrow color */}
                <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6" sx={{ marginX: 2, color: 'white' }}>
                {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'No date selected'}
            </Typography>
            <IconButton onClick={handleNextDay} sx={{ color: 'white' }}> {/* Arrow color */}
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
};

export default DatePicker;
