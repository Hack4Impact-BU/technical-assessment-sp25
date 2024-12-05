export interface Song {
    id: number;
    title: string | 'No Title';
    artist: string | 'Unknown';
    thumbnail_url: string | null;
    genius_url: string;
    featured_date?: string;
    num_votes?: number;
}

export interface SongApiResponse {
    earliestAvailableDate: string;
    queriedDate: string;
    songs: Song[];
}