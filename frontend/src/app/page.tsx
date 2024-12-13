// range of ids: 1-11149999
"use client";

import { useEffect, useState } from "react";
import CommentForm from "./components/CommentForm";
import { Comment, Song } from "./types";
import { Button } from "@mui/material";
import Comments from "./components/Comments";
import { FaAnglesRight } from "react-icons/fa6";
import { FaAnglesLeft } from "react-icons/fa6";

export default function Home() {
  const [songs, setSongs] = useState<Song[]>(); // songs state for array loop
  const [comments, setComments] = useState<Comment[]>(); // comments state for array loop
  const [days, setDays] = useState(0); // how many days starting from today
  const [date, setDate] = useState(new Date().toLocaleDateString()); // date
  const [favoriteSong, setFavoriteSong] = useState('') // favoriteSong on whichever day it is
  const [frequentCommenters, setFrequentCommenters] = useState() // frequentCommenters for checks
  
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
          setComments(data.result.comments);
          setFavoriteSong(data.result.favorite_song)
          setFrequentCommenters(data.frequentCommenters)
        } else { // if no success, basically just show a template shell
          setSongs(undefined);
          setComments(undefined);
          setFavoriteSong("")
          setFrequentCommenters(undefined)
        }
      });
    return () => {};
  }, [date]);

  const updateComments = (
    name: string,
    comment: string,
    timestamp: string,
    favorite_song: string
  ): void => {
    fetch("http://localhost:4000/update_comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date,
        comment: { name: name, comment: comment, timestamp: timestamp},
        favorite_song: favorite_song != '' ? songs?.findIndex((value) => value.title == favorite_song) : undefined 
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComments(data.comments.comments);
          setFrequentCommenters(data.frequentCommenters)
        }
      });
  };
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex w-full bg-ctp-crust p-6">
        <b>Music Discussion Board</b>
      </div>
      <main className="flex flex-col p-5 w-full">
        <div className="flex justify-end mb-5 items-center gap-5">
          <Button variant="contained" onClick={() => handleDate(-1)} className="bg-ctp-blue hover:opacity-90">
            <FaAnglesLeft />
          </Button>
          {date}
          <Button variant="contained" onClick={() => handleDate(1)} className="bg-ctp-blue hover:opacity-90">
            <FaAnglesRight />
          </Button>
        </div>
        <div className="flex items-center justify-center w-full mb-5 gap-5 p-5">
          {songs
            ? songs.map((song, index) => {
                return (
                  <div key={index} className="border-2 w-full flex flex-col items-center p-3 rounded-lg ">
                    <a href={song.link} target="_blank">
                      <img
                        src={song.cover}
                        width={200}
                        height={200}
                        className="mb-3"
                      />
                    </a>
                    <div className="flex justify-center">{song.title}</div>
                    <div className="flex justify-center">By</div>
                    <div className="flex justify-center">{song.artist}</div>
                    <div className="flex justify-center">{favoriteSong == song.title && "(Voted most favorite song by everyone!)"}</div>
                  </div>
                );
              })
            : Array.from(Array(3).keys()).map((_, index) => { // template shell for when theres no song data
                return (
                  <div className="border" key={index}>
                    <img
                      src="https://placehold.co/600x400"
                      width={600}
                      height={400}
                      className="mb-3 opacity-0"
                    />
                  </div>
                );
              })}
        </div>
        <Comments comments={comments} frequentCommenters={frequentCommenters} />
        {songs && <CommentForm getData={updateComments} song_titles={[...songs.map((value) => {return value.title})]} />}
      </main>
    </div>
  );
}
