import './board.css'
import { useState, useEffect } from 'react';



function Board({date}){

    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState('')    

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
                body: JSON.stringify({ name, comment }),
            });

            const result = await response.json();
            setComments([...comments, { name, comment }]);
            // Clear input fields
            setName(''); 
            setComment('');
        } catch (e) {
            console.error(e);
        }
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

                    <button onClick={postComment}>Post</button>
                </div>
            }

            <div className="comments-section">
                <h3>Comments</h3>
                {comments.map((c, index) => (
                    
                    <div key={index} className="comment">
                        <h4>{c.name}:</h4>
                        <p>{c.comment}</p>
                    </div>
                ))}
            </div>

        </div>
    )

}

export default Board