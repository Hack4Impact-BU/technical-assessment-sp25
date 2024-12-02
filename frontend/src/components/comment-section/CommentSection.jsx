import * as React from 'react';
import { Box, Tabs, Tab, Typography} from '@mui/material';
import PropTypes from 'prop-types';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function CommentSection() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{
                width: '100%',
                margin: 'auto',

        }}>
            <Box sx={{ 
                borderBottom: 1, 
                borderColor: 'divider', 
                display: 'flex', 
                width: '500px',
                margin: 'auto',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingTop: 2}}>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Typography variant='h5' sx={{color: '#271F30'}}>Comments</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Tabs 
                        value={value} 
                        onChange={handleChange}
                    >
                        <Tab label="Song 1" {...a11yProps(0)} />
                        <Tab label="Song 2" {...a11yProps(1)} />
                        <Tab label="Song 3" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                
            </Box>
            <CustomTabPanel value={value} index={0}>
                Song 1
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Song 2
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Song 3
            </CustomTabPanel>
        </Box>
    )
}

export default CommentSection;
