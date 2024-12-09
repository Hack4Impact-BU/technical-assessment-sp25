import { useState, useEffect} from "react";
import axios from "axios";

import MusicCard from "./components/musicCard"
import Comment from "./components/comments"
import Popup from "./components/popup"
import LoadingSVG from "./components/loadingSVG";

interface Songs {
  name: string,
  artist: string,
  link: string,
  imageLink: string,
  votes: number
}

interface Comments {
  username: string,
  comment: string,
  isVerified: Boolean
}

function App() {

  const todayDate = new Date().toISOString().split("T")[0];

  const [isModalOpen, setIsModalOpen] = useState<Boolean>(false);
  const [isLoading, setLoading] = useState<Boolean>(false);
  const [showPreviousButton, setShowPreviousButton] = useState<Boolean>(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentSongs, setSongs] = useState<Array<Songs>>([]);
  const [currentComments, setComments] = useState<Array<Comments>>([]);
  const [todayWinner, setWinner] = useState<String>("");

  const formatDateUTC = (date: Date) => {
    return date.toISOString().split('T')[0];
  }

  const previousDate = () => {
    const prevDate = currentDate.setUTCDate(currentDate.getUTCDate() - 1);
    const updatedUTCDate = new Date(prevDate)
    setCurrentDate(updatedUTCDate)
  }
  
  const nextDate = () => {
    const nextDate = currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    const updatedUTCDate = new Date(nextDate)
    setCurrentDate(updatedUTCDate)
  }

  const handleOpen = () => {
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const getCurrentDate = async () => {
    setLoading(true)
    const currentDateCalled = formatDateUTC(currentDate);
    try {
      const dataResponse = await axios.get(`https://songs-2b0cfb95d5c2.herokuapp.com/api/currentDate/${currentDateCalled}`);
      const { songs, comments, winnerToday}: { songs: Array<Songs>, comments: Array<Comments>, winnerToday: String } = dataResponse.data;

      setSongs(songs);
      setComments(comments);
      setWinner(winnerToday);

      await getDateBefore();
      setLoading(false)
    } catch (error) {
      console.error("Error fetching current date:", error);
    }
  }

  const getDateBefore = async () => {
    const prevDate = new Date(currentDate);
    prevDate.setUTCDate(prevDate.getUTCDate() - 1);
    const currentDateCalled = formatDateUTC(prevDate);
    try {
      await axios.get(`https://songs-2b0cfb95d5c2.herokuapp.com/api/currentDate/${currentDateCalled}`);
      setShowPreviousButton(true);
    } catch (error) {
      setShowPreviousButton(false);
    }
  }

  const getComments = async () => {
    setLoading(true)
    try {
      const dataResponse = await axios.get(`https://songs-2b0cfb95d5c2.herokuapp.com/api/refresh/comments`);
      const { comments }: { comments: Array<Comments> } = dataResponse.data;
      setComments(comments);
      setLoading(false)
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getCurrentDate();
  }, [currentDate])

  return (
    <div>

      <div className={`w-full h-full fixed top-0 left-0 bg-white z-50 ${isLoading ? "block" : "hidden"}`}>
        <div className="flex justify-center items-center mt-[45vh]">
          <LoadingSVG />
        </div>
      </div>

      <div className="bg-[#ffff64] py-10"></div>

      <div className="w-full max-w-7xl mx-auto mt-10">
        <div className="flex items-center justify-center lg:justify-end mx-5 p-4">
            <button className={`rounded-lg px-4 py-2 bg-black text-white font-bold ${showPreviousButton ? "block" : "hidden"} `} onClick={previousDate}>Previous</button>
            <p className="mx-5 text-center font-bold">{formatDateUTC(currentDate)}</p>
            <button className={`rounded-lg px-4 py-2 bg-black text-white font-bold ${todayDate === formatDateUTC(currentDate) ? "hidden" : "block"} `} onClick={nextDate}>Next</button>
        </div>
      </div>

      <section className="w-full max-w-7xl mx-auto my-10">
        <div className="mx-5 text-center">
          {todayWinner.length > 0 ? <h1 className="text-3xl font-bold">Winner: {todayWinner}</h1> : <h1 className="text-3xl font-bold">Winner: Unknown</h1>}
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto my-10">
        <div className="mx-5 grid grid-cols-1 lg:grid-cols-3 gap-8 place-items-center">
          {currentSongs.map((song, index) => (
            <MusicCard key={index} name={song.name} artist={song.artist} link={song.link} imageLink={song.imageLink}/>
          ))}
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto my-10">
        <Popup currentState={isModalOpen ? "block" : "hidden"} currentSongs={currentSongs} onClose={handleClose} refreshComment={getComments}/>
        <div className="bg-slate-100 p-4 mx-5 rounded-lg items-center justify-center">
          <div className="flex justify-end">
            <button onClick={handleOpen} className={`rounded-lg p-4 bg-black text-white font-bold ${formatDateUTC(currentDate) != todayDate ? "hidden" : "block"}`}> Add comment</button>
          </div>
          <div className={`flex justify-center items-center mt-10 ${isLoading ? "block" : "hidden"}`}>
            <LoadingSVG />
          </div>
          <div className={`${isLoading ? "hidden" : "block"}`}>
            <div className="h-96 overflow-y-auto">
              {currentComments.map((comment, index) => (
                <Comment key={index} name={comment.username} commentText={comment.comment} isVerified={comment.isVerified} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#ffff64] py-20"></footer>
    </div>
  )
}

export default App
