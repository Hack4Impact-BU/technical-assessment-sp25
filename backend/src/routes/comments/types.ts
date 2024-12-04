export interface Comment {
    id: number;
    content: string;
    user_id: number;
    created_at: string;
    username: string;
    top_contributor: boolean;
}

export interface User {
    id: number;
    username: string;
    top_contributor: boolean;
}