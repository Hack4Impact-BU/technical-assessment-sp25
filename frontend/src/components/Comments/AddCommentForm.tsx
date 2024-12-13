// src/components/Comments/AddCommentForm.tsx

import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import api from '../../services/api';
import { format } from 'date-fns';

interface AddCommentFormProps {
    onCommentAdded: () => void;
    selectedDate: Date | null; // Add selectedDate prop
  }
  const AddCommentForm: React.FC<AddCommentFormProps> = ({ onCommentAdded, selectedDate }) => {
    const [content, setContent] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content || !username) {
          setError('All fields are required.');
          return;
        }
      
        if (!selectedDate) {
          setError('Please select a date.');
          return;
        }
      
        setLoading(true);
        setError(null);
        try {
          const formattedDate = format(selectedDate, 'yyyy-MM-dd');
          await api.post('/comments', {
            content,
            username,
            date: formattedDate, // Include the date in the request
          });
          setContent('');
          setUsername('');
          onCommentAdded();
        } catch (err: any) {
          setError(err.response?.data?.error || 'Failed to add comment.');
        } finally {
          setLoading(false);
        }
      };
    
    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <Typography variant="h6">Add a Comment</Typography>
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
                required
                sx={{
                    backgroundColor: 'white',
                    borderRadius: '4px',
                }}
            />
            <TextField
                label="Comment"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
                margin="normal"
                required
                sx={{
                    backgroundColor: 'white',
                    borderRadius: '4px',
                }}
                multiline
                rows={4}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </Button>
        </form>
    );
};

export default AddCommentForm;
