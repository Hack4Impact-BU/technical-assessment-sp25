import './board.css'
import { useState, useEffect } from 'react';
import { FaCrown } from "react-icons/fa";

//import HowToRegIcon from '@mui/icons-material/HowToReg';
// import { Crown } from 'lucide-react';




function Board({date, songs}){

    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState('')
    const [frequentContributors, setFrequentContributors] = useState([]);
    const [selectedSong, setSelectedSong] = useState(''); 

    // Get comments
    async function getComments() {

        try {
            const response = await fetch('http://localhost:4000/board', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date }),
            });

            const data = await response.json();

            if (data.message) {
                // If backend returns a message/error 
                setMessage(data.message);
                setComments([]);
            } else {
                // Otherwise, update comments
                setComments(data);
            }
        } catch (e) {
            console.error(e);
        }
    }


    // Post a new comment
    async function postComment() {
        try {
            if (!name || !comment) {
                setMessage('Name and comment are required.');
                return;
            }

            const response = await fetch('http://localhost:4000/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, comment, selectedSong}),
            });

            const result = await response.json();
            setComments([...comments, { name, comment }]);
            // Clear input fields
            setName(''); 
            setComment('');
            setSelectedSong('')
            
        } catch (e) {
            console.error(e);
        }
    }

    // Function to count names
    function getNameCounts(comments) {
        const counts = {};
        comments.forEach((comment) => {
            counts[comment.name] = (counts[comment.name] || 0) + 1;
        });
        return counts;
    }

    // Function to find frequent contributors
    function findFrequentContributors() {
        const counts = getNameCounts(comments);
        const frequentNames = Object.keys(counts).filter((name) => counts[name] > 1);
        setFrequentContributors(frequentNames);
    }

    // Get comments when page is rendered
    useEffect(() => {
        try{
            getComments();
        }
        catch(e){
            console.error(e);
        }
        
    }, [date]);

    useEffect(() => {
        findFrequentContributors();
    }, [comments]);


    return(
        <div class="community-board">

            <h2>Comment Board</h2>

            {/* make the form availabe for only today's songs */}
            {date === new Date().toLocaleDateString() &&
                <div className="comment-form">
                    <input type="text" placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <textarea placeholder="Your Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>

                <select
                    value={selectedSong}
                    onChange={(e) => setSelectedSong(e.target.value)}
                >
                    <option value="">Select to vote for a song</option>
                    {songs.map((song) => (
                        <option key={song.id} value={song.id}>{song.title}</option> // Use song.id as the value
                    ))}
                </select>

                    <button onClick={postComment}>Post</button>
                </div>
            }

            <div className="comments-section">
                <h3>Comments</h3>
                {comments.map((c, index) => (
                    
                    <div key={index} className="comment">
                        <h4>{c.name}
                            {frequentContributors.includes(c.name) && (
                                <span className="checkmark"><FaCrown/></span>
                            )}:</h4>
                        
                        <p>{c.comment}</p>
                    </div>
                ))}
            </div>

        </div>
    )

}

export default Board