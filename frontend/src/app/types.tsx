export interface Comment { // comment type for typing
    comment: string,
    timestamp: string,
    name: string
}

export interface Song { // song type for typing
    title: string,
    link: string,
    artist: string,
    cover: string,
}

export interface CommentAggregatedData { // commentaggregateddata type for typing
    name: string
}