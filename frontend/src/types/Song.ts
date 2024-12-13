// src/types/Song.ts

export interface Artist {
    api_path: string;
    cover_art_url: string;
    full_title: string;
    id: number;
    name: string;
    primary_artist_names: string;
    release_date_for_display: string;
    url: string;
    // Add any other relevant fields
}

// src/types/Song.ts

// src/types/Song.ts

export interface Song {
    id: number;
    title: string;
    artist: string; // Changed from Artist object to string
    album: string;
    featured_date: string;
    thumbnail_url: string | null;
    genius_url: string;
    num_votes: number;
}
