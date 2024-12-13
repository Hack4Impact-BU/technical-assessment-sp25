

import React, { useState } from 'react';
import { Button } from '@mui/material';
import api from '../../services/api';

interface VoteButtonProps {
    songId: number;
    onVoteSuccess: () => void; 
}

const VoteButton: React.FC<VoteButtonProps> = ({ songId, onVoteSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVote = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.post('/songs/vote', { song_id: songId });
            onVoteSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to vote');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleVote} disabled={loading}>
                {loading ? 'Voting...' : 'Vote'}
            </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default VoteButton;
