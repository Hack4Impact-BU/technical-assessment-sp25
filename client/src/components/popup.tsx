import { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';

interface Songs {
  name: string,
  artist: string,
  link: string,
  imageLink: string
}

interface PopupProps {
  currentState: string,
  currentSongs: Array<Songs>,
  onClose: () => void,
  refreshComment: () => void
}

const Popup = ({currentState, onClose, currentSongs, refreshComment} : PopupProps) => {
  const [userNameText, setUserNameText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [songChoiceText, setSongChoiceText] = useState('');

  const handleUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserNameText(event.target.value);
  };
  
  const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCommentText(event.target.value);
  };

  const handleSongSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSongChoiceText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userNameText) {
      alert("Please fill out all username");
      return;
    } else if (!commentText){
      alert("Please fill out all comment");
      return;
    }
    
    try {
      await axios.post('https://songs-2b0cfb95d5c2.herokuapp.com/api/currentDate/comment', {
        username: userNameText,
        comment: commentText,
        songChoice: songChoiceText,
      });

      onClose();
      refreshComment();
      setUserNameText("");
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment and vote:", error);
    }
  };

  useEffect(() => {
    if (currentSongs.length > 0) {
      setSongChoiceText(currentSongs[0].name);
    }
  }, [currentSongs]);

  return(
      <div className={`fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity ` + currentState}>
        <div className="w-full max-w-xl">
          <form className="bg-white items-center justify-center shadow-md rounded px-8 pt-6 pb-8 mx-5" onSubmit={handleSubmit}>
            <div className="flex justify-end" onClick={onClose}>
              <div className="cursor-pointer p-2 bg-slate-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="">
              <p className="text-xl font-bold">Username</p>
              <input type="text" placeholder="Username" className="bg-slate-100 p-2 rounded-lg" value={userNameText} onChange={handleUserChange}></input>
            </div>

            <div className="mt-5">
              <p className="text-xl font-bold">Comment</p>
              <input type="text" maxLength={300} placeholder="Your comment" value={commentText} onChange={handleCommentChange} className="bg-slate-100 p-2 w-full rounded-lg"></input>
              <p>Characters remaining: {300 - commentText.length}</p>
            </div>

            <div className="mt-5">
              <p className="text-xl font-bold">Select song to vote for</p>
              <select className="bg-slate-100 p-2 w-full rounded-lg" onChange={handleSongSelectChange}>
                {currentSongs.map((element, index) => (
                <option key={index} >{element.name}</option>
                ))}
              </select>
            </div>

            <button className="bg-black px-4 py-2 mt-5 rounded-lg text-white text-xl font-bold" type="submit">Done</button>
          </form>
        </div>
      </div>
  )
}

export default Popup