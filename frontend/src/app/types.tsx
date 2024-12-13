export interface Comment {
    comment: string,
    timestamp: string,
    name: string
}

export interface Song {
    title: string,
    link: string,
    artist: string,
    cover: string,
}

export interface CommentAggregatedData {
    name: string
}