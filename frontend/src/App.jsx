import Date from './components/date/Date.jsx';
import SongDisplay from './components/song-display/SongDisplay.jsx';
import Comment from './components/comment/Comment.jsx';
import CommentSection from './components/comment-section/CommentSection.jsx';
import { Box } from '@mui/material';

function App() {
  return (
    <Box sx={{
      bgcolor: "#D0FCB3",
      position: 'fixed',
      height: '100%',
      width: '100%',
      left: 0,
      top: 0,
      overflow: 'auto',
    }}>
      <Date />
      <SongDisplay/>
      <Comment/>
      <CommentSection/>
      
    </Box>
  )
}

export default App

