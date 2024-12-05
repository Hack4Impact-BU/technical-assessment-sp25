export interface Song {
    id: number;
    title: string | 'No Title';
    artist: string | 'Unknown';
    thumbnail_url: string | null;
    genius_url: string;
    num_votes?: number;
    featured_date?: string;
}