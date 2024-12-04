import { addComment } from "../../api/comments";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Close from "@mui/icons-material/Close";

type NewCommentFormProps = {
    commentFormOpen: boolean;
    setCommentFormOpen: (open: boolean) => void;
}

export default function NewCommentForm({ commentFormOpen, setCommentFormOpen }: NewCommentFormProps) {
    const [ comment, setComment ] = useState('');
    const [ username, setUsername ] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ['comments'],
        mutationFn: addComment,
        onSuccess: () => { 
            queryClient.invalidateQueries({
                queryKey: ['comments']
            })
        }
    });

    const handleSubmit = () => {
        mutation.mutate({ content: comment, username });
        setComment('');
        setUsername('');
    }

    return (
        <Modal
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            sx={{
                bgcolor: 'background.paper',
            }}
            open={commentFormOpen}
            onClose={() => setCommentFormOpen(false)}
        >
            <Box
                className='p-4 flex flex-col gap-4'
                component="form"
                noValidate
                autoComplete="off"
            >
                <TextField 
                    variant='standard'
                    className='self-start'
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    variant='standard'
                    label="Comment e.g. 'Today's songs were great!'"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={mutation.isPending || !comment || !username || mutation.isError}
                    sx={{
                        bgcolor: 'secondary.main'
                    }}
                >
                    {
                        mutation.isPending
                            ? 'Adding comment...'
                            : mutation.isError
                                ? 'Failed to add comment'
                                : 'Add comment'
                    }
                </Button>
                <Tooltip title="Close">
                    <IconButton
                        className='absolute top-0 right-0'
                        onClick={() => setCommentFormOpen(false)}
                    >
                        <Close />
                    </IconButton>
                </Tooltip>
            </Box>
        </Modal>
    )
}