export interface Song {
    id: number;
    title: string | 'No Title';
    artist: string | 'Unknown';
    thumbnail_url: string | null;
    genius_url: string;
}

export interface SongApiResponse {
    earliestAvailableDate: string;
    queriedDate: string;
    songs: Song[];
}