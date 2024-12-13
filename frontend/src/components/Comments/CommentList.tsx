// src/components/Comments/CommentList.tsx

import React from 'react';
import { Comment } from '../../types/Comment';
import { List, ListItem, ListItemText, Typography, Avatar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface CommentListProps {
    comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    if (comments.length === 0) {
        return <Typography>No comments for this date.</Typography>;
    }

    return (
        <List>
            {comments.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start">
                    <Avatar>{comment.username.charAt(0).toUpperCase()}</Avatar>
                    <ListItemText
                        primary={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="subtitle1" component="span">
                                    {comment.username}
                                </Typography>
                                {comment.top_contributor && (
                                    <StarIcon color="warning" sx={{ marginLeft: 0.5 }} />
                                )}
                            </div>
                        }
                        secondary={
                            <Typography variant="body2" color="white">
                                {comment.content}
                            </Typography>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default CommentList;
