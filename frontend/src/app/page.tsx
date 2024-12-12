// range of ids: 1-11149999
"use client";

import { useEffect, useState } from "react";
import CommentForm from "./components/CommentForm";
import { Comment, Song } from "./types";
import { Button } from "@mui/material";
import Comments from "./components/Comments";
const d = new Date();

export default function Home() {
  const [songs, setSongs] = useState<Song[]>();
  const [comments, setComments] = useState<Comment[]>();

  const [days, setDays] = useState(0);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const handleDate = (numDays: number): void => {
    const resultDate = new Date(new Date());
    resultDate.setDate(resultDate.getDate() + (days + numDays));
    resultDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (resultDate <= today) {
      setDate(resultDate.toLocaleDateString());
      setDays((days) => days + numDays);
    }
  };

  useEffect(() => {
    console.log("FETCHING");
    fetch("http://localhost:4000/songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSongs(data.result.songs);
          setComments(data.result.comments)
        }
      });
    return () => {};
  }, [date]);

  const updateComments = (
    name: string,
    comment: string,
    timestamp: string
  ): void => {
    fetch("http://localhost:4000/update_comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date,
        comment: { name: name, comment: comment, timestamp: timestamp },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // console.log(data.comments.comments)
          setComments(data.comments.comments);
        }
      });
  };
  console.log(comments)
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full bg-ctp-crust p-6">
        <b>Music Discussion Board</b>
      </div>
      <main className="flex flex-col border p-5">
        <div className="flex justify-end mb-5">
          <Button variant="outlined" onClick={() => handleDate(-1)}>
            Back
          </Button>
          {date}
          <Button variant="outlined" onClick={() => handleDate(1)}>
            Forward
          </Button>
        </div>
        <div className="flex items-center justify-center w-full mb-5 gap-5">
          {songs &&
            songs.map((song, index) => {
              return (
                <div key={index} className="border">
                  <a href={song.link} target="_blank">
                    <img
                      src={song.cover}
                      width={600}
                      height={400}
                      className="mb-3"
                    />
                  </a>
                  <div className="flex justify-center">{song.song_title}</div>
                  <div className="flex justify-center">By</div>
                  <div className="flex justify-center">{song.artist}</div>
                </div>
              );
            })}
        </div>
        <Comments comments={comments} />
        <CommentForm getData={updateComments} />
      </main>
    </div>
  );
}
