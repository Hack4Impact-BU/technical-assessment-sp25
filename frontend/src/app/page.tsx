// range of ids: 1-11149999
"use client";

import { useState } from "react";
import CommentForm from "./components/CommentForm";
import { Comment } from "./types";
import { Button } from "@mui/material";
import Comments from "./components/Comments";
const d = new Date()

export default function Home() {
  const [songs] = useState(["Song 1", "Song 2", "Song 3"]);
  const [comments] = useState<Comment[]>([
    {"author": "John", "comment": "Comment 1", "time": d.toISOString()},
    {"author": "John", "comment": "Comment 1", "time": d.toISOString()},
    {"author": "John", "comment": "Comment 1", "time": d.toISOString()},
    {"author": "John", "comment": "Comment 1", "time": d.toISOString()},
    {"author": "John", "comment": "Comment 1", "time": d.toISOString()},
    {"author": "John", "comment": "Comment 1", "time": d.toISOString()},
    {"author": "John", "comment": "Comment 1", "time": d.toISOString()},
    {"author": "John", "comment": "Comment 1", "time": d.toISOString()},
    {"author": "John", "comment": "Comment 1", "time": d.toISOString()},
    {"author": "John", "comment": "Comment 1", "time": d.toISOString()},
    {"author": "John", "comment": "Comment 1", "time": d.toISOString()},
    {"author": "John", "comment": "Comment 1", "time": d.toISOString()},
  ]);

  const [days, setDays] = useState(0)
  const [date, setDate] = useState(new Date().toLocaleDateString())
  const handleDate = (numDays: number): void => {
    const resultDate = new Date(new Date())
    resultDate.setDate(resultDate.getDate() + (days + numDays))
    setDate(resultDate.toLocaleDateString())
    setDays((days) => days + numDays)
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full bg-ctp-crust p-6">
        <b>Music Discussion Board</b>
      </div>
      <main className="flex flex-col border p-5">

        <div className="flex justify-end mb-5">
        <Button variant="outlined" onClick={() => handleDate(-1)}>Back</Button>
        {date}
        <Button variant="outlined" onClick={() => handleDate(1)}>Forward</Button>
        </div>
        <div className="flex items-center justify-center w-full mb-5 gap-5">
          {songs.map((song, index) => {
            return (
              <div key={index} className="border">
                <a href="https://www.google.com">
                  <img src="https://placehold.co/600x400" className="mb-3" />
                </a>
                <div className="flex justify-center">{song}</div>
              </div>
            );
          })}
        </div>
        <Comments comments={comments} />
        <CommentForm getData={() => console.log("test")} />
      </main>
    </div>
  );
}
