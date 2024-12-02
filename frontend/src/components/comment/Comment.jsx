import * as React from 'react';
import { Box, TextField, FormControl, RadioGroup, Radio, FormControlLabel, Button} from '@mui/material';
// import { SendIcon } from '@mui/icons-material/Send';
import SendIcon from '@mui/icons-material/Send';

function Comment() {
    const [username, setUsername] = React.useState('');
    const [comment, setComment] = React.useState('');

    return (
        <Box
            id="commentArea"
            component="form"
            sx={{ 
                borderStyle: 'solid', 
                borderColor: "#AF9AB2", 
                width: 1300, 
                display: 'flex', 
                justifyContent: 'center', 
                margin: 'auto',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 3,
                marginTop: '25px',
                marginBottom: '30px'

            }}
            noValidate
            autoComplete='off'
        >

        <FormControl>
                <RadioGroup
                    row
                    required
                    defaultValue=""
                    name="song-choice"
                    sx={{padding: 2}}
                >
                    <FormControlLabel 
                    value="song1" 
                    control={<Radio sx={{ '&.Mui-checked': { color: '#271F30' } }} />} 
                    label="Song 1" />
                    <FormControlLabel 
                    value="song2" 
                    control={<Radio sx={{ '&.Mui-checked': { color: '#271F30' } }} />} 
                    label="Song 2" />
                    <FormControlLabel 
                    value="song3" 
                    control={<Radio sx={{ '&.Mui-checked': { color: '#271F30' } }} />} 
                    label="Song 3" />
                </RadioGroup>
            </FormControl>

            <TextField
                required
                id="username-input"
                label="UserName"
                variant="filled"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                sx={{
                    width: 250, 
                    margin: 1,
                    border: 'solid',
                    borderColor: '#AF9AB2',
                    borderRadius: 2,
                    '& .MuiInputLabel-root': { color: '#271F30',},

                }}
            />
            
            <TextField
                id="comment-input"
                label="Comment"
                variant='filled'
                multiline
                maxRows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                sx={{
                    width: 500, 
                    margin: 1, 
                    border: 'solid', 
                    borderColor: '#AF9AB2', 
                    borderRadius: 2,
                    '& .MuiInputLabel-root': { color: '#271F30' },
                }}
            />

            <Button 
            variant='contained' 
            color='#271F30'
            
            size='large' 
            onClick={() => {
                alert('Posted');
            }}
            endIcon={<SendIcon/>}
            sx={{
                bgcolor:'#6C5A49',
                marginLeft: '20px',
            }}
            >
                Post
            </Button>
        </Box>
    )
}

export default Comment;

