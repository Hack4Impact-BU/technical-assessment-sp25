import { addComment } from "../../api/comments";
import { voteForSong } from "../../api/songs";
import { Song } from "../../types/songs";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Close from "@mui/icons-material/Close";

type NewCommentFormProps = {
    commentFormOpen: boolean;
    setCommentFormOpen: (open: boolean) => void;
    date: Date;
    songs: Song[];
}

export default function NewCommentForm({ commentFormOpen, setCommentFormOpen, date, songs }: NewCommentFormProps) {
    const [ comment, setComment ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ selectedSongId, setSelectedSongId ] = useState<number>(0);
    const queryClient = useQueryClient();

    const commentsMutation = useMutation({
        mutationKey: ['comments'],
        mutationFn: addComment,
        onSuccess: () => { 
            queryClient.invalidateQueries({
                queryKey: ['comments']
            })
        }
    });

    const voteMutation = useMutation({
        mutationKey: ['songs'],
        mutationFn: voteForSong,
    });


    const handleSubmit = () => {
        if (selectedSongId === 0 || !comment || !username) {
            return;
        }
        voteMutation.mutate({ id: selectedSongId });
        commentsMutation.mutate({ content: comment, username });
        setComment('');
        setUsername('');
        setSelectedSongId(0);
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
                <Select 
                    variant='standard'
                    value={selectedSongId}
                    onChange={(e) => setSelectedSongId(e.target.value as number)}
                    className='self-start w-1/2'
                    label="Select your favorite song"
                    disabled={songs.length === 0}
                >
                    {songs.map((song) => (
                        <MenuItem key={song.id} value={song.id}>
                            {song.title} by {song.artist}
                        </MenuItem>
                    ))}
                </Select>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={commentsMutation.isPending || !comment || !username || commentsMutation.isError}
                    sx={{
                        bgcolor: 'secondary.main'
                    }}
                >
                    {
                        commentsMutation.isPending
                            ? 'Adding comment...'
                            : commentsMutation.isError
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