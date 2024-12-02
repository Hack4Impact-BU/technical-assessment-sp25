import * as React from 'react';
import { Box, Typography } from '@mui/material';
import "./Date.css";

function Date() {
    const [date, setDate] = React.useState("2024-11-29");

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
            value={date} 
            onChange={(event) => {
                const newDate = event.target.value;
                console.log("selected date: " + newDate);
                setDate(newDate);
            }}
            />
        </div>
    );
}

export default Date;