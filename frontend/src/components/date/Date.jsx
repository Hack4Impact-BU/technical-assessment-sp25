import * as React from 'react';
import { Box, Typography } from '@mui/material';
import "./Date.css";

function Date({ setSelectedDate }) {
    const [ tempDate, setTempDate ] = React.useState('2024-12-02');

    return (

        <div className="flex-container2">
            <Box
                component="section" 
                sx={{
                    borderStyle: 'solid', 
                    borderColor: "#AF9AB2", 
                    width: 400, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 3,
                }}
            >
                <Typography variant="h4" sx={{color: '#271F30'}}>Music Rating Platform</Typography>
            </Box>
            <input 
                type="date" 
                id="date" 
                value={tempDate}
                min='2024-12-02'
                onChange={(event) => {
                    const newDate = event.target.value;
                    console.log("selected date: " + newDate);
                    setSelectedDate(newDate);
                    setTempDate(newDate);
                }}
            />
        </div>
    );
}

export default Date;