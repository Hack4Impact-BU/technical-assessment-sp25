import dailyEntry from "../models/dailySong.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
/* 
  This function will fetch the current day the user specifies. Since we fetch this function when the application loads
  we will create a new entry in out mongoDB collection if there is not already one for the current day as well.
  Will also finalize the previous day winner since we should do it on the initial load of the website.
*/
const getCurrentEntry = async (req, res) => {
  try {
  
    const todayDate = new Date().toISOString().split("T")[0];
    const currentDate = req.params.date;

    const currentDoc = await dailyEntry.findOne({ date: currentDate })

    const previousDate = new Date(currentDate);
    previousDate.setUTCDate(previousDate.getUTCDate() - 1);
    const previousDateString = previousDate.toISOString().split("T")[0];

    finalizePreviousDayWinner(previousDateString);

    /* 
      This statement will create the current day object in the mongoDB collection, otherwise if we query like
      the day before and there is no object in the collection we should send a 404 to the frontend since there was no
      doc created for that day.
    */
    if (currentDoc === null){
      if (currentDate === todayDate){
        const threeNewSongs = await fetchThreeSongs();

        const newEntry = new dailyEntry({
          date: todayDate,
          songs: [
            {
              name: threeNewSongs[0].songTitle, 
              artist: threeNewSongs[0].songArtist, 
              link: threeNewSongs[0].songLyric, 
              imageLink: threeNewSongs[0].songImgUrl,
            },
            {
              name: threeNewSongs[1].songTitle, 
              artist: threeNewSongs[1].songArtist, 
              link: threeNewSongs[1].songLyric, 
              imageLink: threeNewSongs[1].songImgUrl,
            },
            {
              name: threeNewSongs[2].songTitle, 
              artist: threeNewSongs[2].songArtist, 
              link: threeNewSongs[2].songLyric, 
              imageLink: threeNewSongs[2].songImgUrl,
            }
          ],
          comments: [],
        });
  
        await newEntry.save();
  
        res.status(200).json(newEntry);
      } else {
        res.status(404).json();
      }
    }

    res.status(200).json(currentDoc);

  } catch (error) {
    
  }
}

/* 
  This function will create a comment based on the current day while also determining if they are verified.
  Then if they have also already voted their song choice will not count multiple times.
*/
const pushComment = async (req, res) => {
  try {
    const todayDate = new Date().toISOString().split("T")[0];

    const currentDoc = await dailyEntry.findOne({ date: todayDate })

    const currentUser = req.body.username;
    const currentComment = req.body.comment;
    const songChoice = req.body.songChoice;

    const totalComments = await dailyEntry.aggregate([
      { $unwind: "$comments" }, 
      { $match: { "comments.username": currentUser } }, 
      {
        $group: {
          _id: "$comments.username", 
          num_comments: { $sum: 1 },
        },
      },
      {$project: {_id: 0, username: "$_id", num_comments: 1}}
    ])

    const totalCommentsToday = await dailyEntry.aggregate([
      { $match: {date: todayDate}},
      { $unwind: "$comments" }, 
      { $match: { "comments.username": currentUser } }, 
      {
        $group: {
          _id: "$comments.username", 
          num_comments: { $sum: 1 },
        },
      },
      {$project: {_id: 0, username: "$_id", num_comments: 1}}
    ])

    const hasCommentedToday = totalCommentsToday.length > 0;

    if (totalComments.length > 0 && totalComments[0].num_comments >= 2){
      currentDoc.comments.push({
        username: currentUser,
        comment: currentComment,
        isVerified: true,
        hasVoted: true
      })
      
      await dailyEntry.updateMany(
        { "comments.username": currentUser },
        { $set: { "comments.$[elem].isVerified": true } },
        { arrayFilters: [{ "elem.username": currentUser }] }
      );

    } else {
      currentDoc.comments.push({
        username: currentUser,
        comment: currentComment,
        isVerified: false,
        hasVoted: true
      })
      if (!hasCommentedToday){
        const song = currentDoc.songs.find((song) => song.name === songChoice);

        song.votes += 1;
      }
    }

    await currentDoc.save();

    res.status(200).json("done");
  } catch (error) {
    
  }
}

/*
  fetches the current day and sends it back to be able to access the current comments
*/
const refreshComment = async (req, res) => {
  try {
    const todayDate = new Date().toISOString().split("T")[0];

    const currentDoc = await dailyEntry.findOne({ date: todayDate })

    res.status(200).json(currentDoc);
  } catch (error) {
    
  }
}

/* 
  This function queries the Genius API to get three random songs that we can use for our mongoDB entry.
  Where we need to also pass in the token given by the API to authorize our request.
*/
const fetchThreeSongs = async () => {
  const songs = [];
  const token = process.env.GENIUS_TOKEN;
  
  while (songs.length < 3){
    try {
      const randomSongID = Math.floor(Math.random() * 300000);
      const responseData = await axios.get(`https://api.genius.com/songs/${randomSongID}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const currentSong = responseData.data.response.song;

      let songDataJson = {
        songTitle: currentSong.title,
        songArtist: currentSong.primary_artist_names,
        songLyric: currentSong.url,
        songImgUrl: currentSong.song_art_image_thumbnail_url
      }

      songs.push(songDataJson);
      
    } catch (error) {
      
    }
  }

  return songs;
}

/*
  Used to finalize the previous day winner based on the number of votes.
*/
const finalizePreviousDayWinner = async (previousDate) => {
  try {
    const previousDoc = await dailyEntry.findOne({ date: previousDate });

    if (!previousDoc) {
      console.log(`No entry found for ${previousDate}.`);
      return;
    }

    if (previousDoc.winnerToday) {
      console.log(`Winner for ${previousDate} is already finalized.`);
      return;
    }

    const songsArray = previousDoc.songs;
    let songName = "";
    let highestVotes = -1;

    for(let i = 0; i < songsArray.length; i++){
      if(songsArray[i].votes > highestVotes){
        songName = songsArray[i].name;
        highestVotes = songsArray[i].votes;
      }
    }

    previousDoc.winnerToday = songName
    await previousDoc.save();

    console.log(`Winner finalized for ${previousDate}: ${songName}`);
  } catch (error) {
    console.error("Error finalizing previous day's winner:", error);
  }
};

export { getCurrentEntry, pushComment, refreshComment};