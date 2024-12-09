import mongoose from 'mongoose';

const dailySong = new mongoose.Schema (
  {
    date: {
      type: String,
      required: true,
      unique: true
    },
    songs: [
    {
      name: { type: String, required: true},
      artist: { type: String, required: true},
      link: { type: String, required: true},
      imageLink: { type: String, required: true},
      votes: {type: Number, default: 0, required: true}
    }
    ],
    comments: [
      {
        username: {type: String, required: true},
        comment: {type: String, max: 300, required: true},
        isVerified: {type: Boolean, default: false, required: true},
        hasVoted: {type: Boolean, required: true}
      }
    ],
    winnerToday: { type: String, default: "", required: false }
  }
);

const dailyEntry = mongoose.model('dailyEntry', dailySong);

export default dailyEntry;