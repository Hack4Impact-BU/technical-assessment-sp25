import React from 'react';
import './App.css'
import Music from './components/music/music';
import Board from './components/board/board';
import { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

function App() {

  const [date, setDate] = useState(new Date().toLocaleDateString()); // Default to today

  function getPrevDate(){
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    setDate(prevDate.toLocaleDateString());
  }

  function getNextDate(){
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() + 1);
    setDate(prevDate.toLocaleDateString());
  }

  return (
    <>
      <header>
        <h1>Music Review Community Board</h1>
      </header>

      
      
      
      <main>
        <div class="date-and-buttons">
          <button onClick={getPrevDate}><ArrowBackIosNewOutlinedIcon  
          sx={{
              backgroundColor: 'transparent',
              fontSize: '15px',
              cursor: 'pointer',
              border: 'none',
              padding: '0',
          }}/></button>
          <p> {date} </p>
          {date !== new Date().toLocaleDateString() && <button onClick={getNextDate}><ArrowForwardIosOutlinedIcon className="icon"
          sx={{
            backgroundColor: 'transparent',
            fontSize: '15px',
            cursor: 'pointer',
            border: 'none',
            padding: '0',
          }}/></button>}
        </div>
        <Music date={date}/>
        
      </main>
      
    </>
  )
}

export default App
