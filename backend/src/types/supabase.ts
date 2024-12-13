// src/types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

// Define the Database interface representing your Supabase schema
export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          id: number;
          user_id: number;
          song_id: number; // Changed from 'daily_song_id' to 'song_id'
          content: string;
          votes: number;
          created_at: string;
        };
        Insert: {
          user_id: number;
          song_id: number; // Changed from 'daily_song_id' to 'song_id'
          content: string;
          votes?: number;
          created_at?: string;
        };
        Update: {
          user_id?: number;
          song_id?: number; // Changed from 'daily_song_id' to 'song_id'
          content?: string;
          votes?: number;
          created_at?: string;
        };
      };
      songs: {
        Row: {
          id: number;
          title: string;
          artist: string;
          album: string;
          featured_date: string;
          thumbnail_url: string | null; // Added
          genius_url: string; // Added
          num_votes: number; // Added
        };
        Insert: {
          title: string;
          artist: string;
          album: string;
          featured_date: string;
          thumbnail_url?: string | null; // Added
          genius_url: string; // Added
          num_votes?: number; // Added
        };
        Update: {
          title?: string;
          artist?: string;
          album?: string;
          featured_date?: string;
          thumbnail_url?: string | null; // Added
          genius_url?: string; // Added
          num_votes?: number; // Added
        };
      };
      users: {
        Row: {
          id: number;
          username: string;
          created_at: string;
          top_contributor: boolean;
        };
        Insert: {
          username: string;
          created_at?: string;
          top_contributor?: boolean;
        };
        Update: {
          username?: string;
          created_at?: string;
          top_contributor?: boolean;
        };
      };
      daily_songs: {
        Row: {
          song_id: number;
          selected_date: string;
        };
        Insert: {
          song_id: number;
          selected_date: string;
        };
        Update: {
          song_id?: number;
          selected_date?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
