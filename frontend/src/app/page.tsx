// range of ids: 1-11149999
"use client";

import { useState } from "react";

export default function Home() {
  const [songs, setSongs] = useState(["Song 1", "Song 2", "Song 3"]);
  const [comments, setComments] = useState([
    "Comment 1",
    "Comment 2",
    "Comment 3",
    "Comment 4",
    "Comment 5",
    "Comment 6",
    "Comment 7",
    "Comment 8",
    "Comment 9",
    "Comment 10",
    "Comment 11",
    "Comment 12",
  ]);
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full bg-ctp-crust p-6">
        <b>Music Discussion Board</b>
      </div>
      <main className="flex flex-col border p-5">
        <div className="flex justify-end mb-5">Dates</div>
        <div className="flex items-center justify-center w-full mb-5 gap-5">
          {songs.map((song, index) => {
            return (
              <div key={index} className="border">
                <img src="https://placehold.co/600x400" className="mb-3" />
                <div className="flex justify-center">{song}</div>
              </div>
            );
          })}
        </div>
        <div className="border flex flex-col max-h-[450px] overflow-scroll gap-10 mb-5">
          {comments.map((comment, index) => {
            return (
              <div key={index} className="flex flex-col border">
                {comment}
              </div>
            );
          })}
        </div>
        <button>Add a Comment</button>
        <button onClick={() => setComments(['test'])}>Placeholder 1</button>
        <button onClick={() => setSongs(['test'])}>Placeholder 2</button>
      </main>
    </div>
  );
}
