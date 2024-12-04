import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Star from '@mui/icons-material/Star';
import Tooltip from '@mui/material/Tooltip';
import { Comment } from '../../types/comments';

type CommentCardProps = {
  comment: Comment;
};

const toFormattedDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString();
}

export default function CommentCard ({ comment }: CommentCardProps) {
    return (
        <Card className='text-left'>
            <CardContent>
                <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    className='flex items-center gap-1'
                >
                    {
                        comment.top_contributor && 
                        <Tooltip title={`${comment.username} is a top-contributor`}>
                            <Star color='secondary' className='text-sm' />
                        </Tooltip>
                    }
                    {comment.username} | {toFormattedDate(comment.created_at)}
                </Typography>
                <Typography variant="h6" component="div">
                    {comment.content}
                </Typography>
            </CardContent>
        </Card>
    )
}