import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

const mongoUrl = process.env.MONGODB_CONNECT_URL;
const mongo = new MongoClient(mongoUrl, {});

mongo.connect().then(() => {
  console.log("Connected to MongoDB");
});

const database = mongo.db("music");
const discussionData = database.collection("songs");

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

app.post("/songs", async (req, res) => {
  const aggregatedData = await discussionData
    .aggregate([
      { $unwind: "$comments" },
      { $project: { name: { $toLower: "$comments.name"} } },
      { $group: { _id: "$name", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $project: { _id: 0, name: "$_id" } },
    ])
    .toArray();
  const date = req.body.date;
  const inputDate = new Date(date);
  const today = new Date();
  let songs = [];

  const query = { date: date };
  const options = {
    projection: { _id: 0 },
  };
  const result = await discussionData.findOne(query, options);
  if (result) {
    return res.json({
      success: true,
      result: result,
      frequentCommenters: aggregatedData
    });
  }
  // didn't find any data, so check if date is today's date, if so create a new document in the db, else return nothing
  if (inputDate.setHours(0, 0, 0, 0) != today.setHours(0, 0, 0, 0)) {
    return res.json({
      success: false,
    });
  }
  // is today's date, so create a new document in mongo and return it
  while (songs.length < 3) { // grab 3 songs
    const num = getRandomInt(7393000, 10024527);
    const response = await fetch(`https://api.genius.com/songs/${num}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
      },
    });
    if (response.ok) {
      const res = await response.json();
      songs.push({
        title: res["response"]["song"].title,
        artist: res["response"]["song"].artist_names,
        link: res["response"]["song"].apple_music_player_url,
        cover: res["response"]["song"].header_image_url,
      });
    }
  }
  const doc = {
    date: date,
    songs: songs,
    comments: [],
    votes: [0, 0, 0],
    favorite_song: "",
  };
  await discussionData.insertOne(doc);
  const data = await discussionData.findOne(query, options);
  res.json({
    success: true,
    result: data,
    frequentCommenters: aggregatedData
  });
});

app.post("/update_comments", async (req, res) => {
  const comment = req.body.comment;
  const date = req.body.date;
  const songVoted = req.body.favorite_song; // song index number in database
  const filter = { date: date };
  const options = {
    projection: { _id: 0, date: 0, songs: 0 },
  };
  let updateDoc = {};
  if (songVoted || songVoted == 0) { // 0 counts as false so must include this 0 condition
    updateDoc = {
      $push: {
        comments: comment,
      },
      $inc: {
        [`votes.${songVoted}`]: 1,
      },
    };
  } else {
    updateDoc = {
      $push: {
        comments: comment,
      },
    };
  }
  await discussionData.updateOne(filter, updateDoc, options); // push comment into database and increment vote if needed
  const query = { date: date };
  const option = {
    projection: { _id: 0 },
  };
  const result = await discussionData.findOne(query, option);
  const aggregatedData = await discussionData
    .aggregate([
      { $unwind: "$comments" },
      { $project: { name: { $toLower: "$comments.name"} } },
      { $group: { _id: "$name", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $project: { _id: 0, name: "$_id" } },
    ])
    .toArray();
  res.json({
    success: true,
    comments: result,
    frequentCommenters: aggregatedData
  });
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
