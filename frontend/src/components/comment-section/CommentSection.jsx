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

function CommentSection({ selectedDate }) {
    const [value, setValue] = React.useState(0);
    const [comments, setComments] = React.useState({ song1: [], song2: [], song3: [] });
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchComments = async () => {
            try {
                setError(null);
                const response = await fetch(`http://localhost:4003/api/commentSection`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ date: selectedDate }),
                });

                if(!response.ok) {
                    throw new Error('Failed to fetch comments');
                }

                const data = await response.json();

                if(data[0] && data[0].songs) {
                    setComments(data[0].songs);
                } else {
                    setComments({ song1: [], song2: [], song3: [] });
                }
            } catch (error) {
                
                console.error('Error fetching comments', error);
                setError(error.message);
            }
        };

        if(selectedDate) {
            fetchComments();
        }
    }, [selectedDate]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const renderComments = () => {
        const songChoice = `song${value+1}`;
        const songComments = comments[songChoice];

        if(!songComments || !songComments.comments || !songComments.comments.length > 0) {
            return (
                <Box sx={{
                    borderStyle:'solid',
                    borderColor: '#AF9AB2',
                    display: 'flex',
                    margin:'auto',
                    justifyContent: 'center',
                    width: '400px',
                    padding: '10px',
                    borderRadius: 3,
                }}>
                    <Typography variant='h6' sx={{color: '#271F30'}}><strong>No comments for Song {value+1}</strong></Typography>
                </Box>
            )
        }

        const comments2 = songComments.comments; 

        return (
            <ul style={{ listStyleType: 'none' }}>
                {comments2.map((comment, idx) => (
                    <li key={idx}>
                        <div style={{
                            padding: '5px',
                        }}>
                            <Box sx={{
                                borderStyle: 'solid',
                                borderColor: '#AF9AB2',
                                display: 'flex',
                                margin:'auto',
                                justifyContent: 'center',
                                width: '600px',
                                padding: '20px',
                                borderRadius: 4,
                            }}>
                                <Typography variant='h6' sx={{color: '#271F30'}}><strong>@{comment.username}:</strong> {comment.comment}</Typography>
                            </Box>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

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
                <Box sx={{display: 'flex', justifyContent: 'center', borderColor: '#AF9AB2'}}>
                    <Tabs 
                        value={value} 
                        onChange={handleChange}
                    >
                        <Tab label="Song 1" sx={{color: '#271F30'}} {...a11yProps(0)} />
                        <Tab label="Song 2" sx={{color: '#271F30'}} {...a11yProps(1)} />
                        <Tab label="Song 3" sx={{color: '#271F30'}} {...a11yProps(2)} />
                    </Tabs>
                </Box>
                
            </Box>
            <CustomTabPanel value={value} index={0}>
                {renderComments('song1')}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                {renderComments('song2')}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                {renderComments('song3')}
            </CustomTabPanel>
        </Box>
    )
}

export default CommentSection;
