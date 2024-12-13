
// src/types/Song.ts

export interface Song {
    id: number;
    title: string;
    artist: string; 
    album: string;
    featured_date: string;
    thumbnail_url: string | null;
    genius_url: string;
    num_votes: number;
}



export interface Comment {
    id: number;
    content: string;
    user_id: number;
    created_at: string;
}

export interface User {
    id: number;
    username: string;
    top_contributor: boolean;
}

export interface DailySongEntry {
    song_id: number;
    selected_date: string;
}

export interface DailySongEntryWithSong extends DailySongEntry {
    song: Song;
}
