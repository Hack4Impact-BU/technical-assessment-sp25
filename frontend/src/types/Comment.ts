// src/types/Comment.ts

export interface Comment {
    id: number;
    content: string;
    user_id: number;
    created_at: string;
    username: string;
    top_contributor: boolean;
}
