

import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabaseClient';
import { Comment, User } from '../types';
import logger from '../utils/logger';
import { format } from 'date-fns';
//get comments for a specific day
export const getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const date = req.query.date as string;
    if (!date || typeof date !== 'string') {
        res.status(400).json({ error: 'Missing required parameter: date' });
        return;
    }

    try {
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        const { data, error } = await supabase
            .from('comments')
            .select(`
                id,
                content,
                user_id,
                created_at,
                users (
                    username,
                    top_contributor
                )
            `)
            .gte('created_at', startDate.toISOString())
            .lt('created_at', endDate.toISOString())
            .order('created_at', { ascending: false });

        if (error) {
            logger.error(`Supabase Error: ${error.message}`);
            throw error;
        }

        const comments: Comment[] = (data as any[]).map((comment: any) => ({
            id: comment.id,
            content: comment.content,
            user_id: comment.user_id,
            created_at: comment.created_at,
            username: comment.users.username,
            top_contributor: comment.users.top_contributor
        }));

        res.status(200).json({ data: comments });
    } catch (e) {
        logger.error(`Error in getComments: ${e}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Adds a comment to the database. Creates a new user if the username does not exist.
 */

export const addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { content, username } = req.body;

    // Validate input
    if (
        !content ||
        !username ||
        typeof content !== 'string' ||
        typeof username !== 'string'
    ) {
        res.status(400).json({ error: 'Missing required parameter(s): content, username' });
        return;
    }

    try {
        // Step 1: Check if user exists
        const { data: existingUsers, error: existingUserError } = await supabase
            .from('users')
            .select('id, top_contributor')
            .eq('username', username);

        let userId: number;
        let topContributor: boolean;

        if (existingUsers && existingUsers.length > 0) {
            // User exists
            userId = existingUsers[0].id;
            topContributor = existingUsers[0].top_contributor;
        } else {
            // User does not exist, insert new user
            const { data: newUserData, error: newUserError } = await supabase
                .from('users')
                .insert({ username })
                .select('id, top_contributor');

            if (newUserError || !newUserData || newUserData.length === 0) {
                logger.error(`Failed to create new user: ${newUserError}`);
                throw newUserError || new Error('Failed to create new user');
            }

            userId = newUserData[0].id;
            topContributor = newUserData[0].top_contributor;
        }

        // Step 2: Determine the current date from 'created_at'
        const currentDate = format(new Date(), 'yyyy-MM-dd');
        logger.info(`Associating comment with date: ${currentDate}`);

        // Step 3: Find top song for the current date
        const { data: topSongData, error: topSongError } = await supabase
            .from('songs')
            .select('id, num_votes')
            .eq('featured_date', currentDate)
            .order('num_votes', { ascending: false })
            .limit(1)
            .single();

        if (topSongError || !topSongData) {
            logger.error(`No top song found for date ${currentDate}: ${topSongError}`);
            res.status(400).json({ error: 'No top song found for the current date' });
            return;
        }

        const songId = topSongData.id;

        // Step 4: Insert comment associated with the top song
        const { data: commentData, error: commentError } = await supabase
            .from('comments')
            .insert({
                user_id: userId,
                song_id: songId,
                content,
                // 'created_at' is automatically set by Supabase
            })
            .select('id, content, user_id, created_at, votes');

        if (commentError || !commentData || commentData.length === 0) {
            logger.error(`Failed to insert comment: ${commentError}`);
            throw commentError || new Error('Failed to insert comment');
        }

        const newComment: Comment = {
            id: commentData[0].id,
            content: commentData[0].content,
            user_id: commentData[0].user_id,
            created_at: commentData[0].created_at,
            // Optional: Include username and top_contributor if needed
        };

        res.status(201).json({ data: newComment });
    } catch (e) {
        logger.error(`Error in addComment: ${e}`);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};
/**
 * Retrieves the top_contributor status for a user by user_id.
 */
export const getTopContributorStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user_id = parseInt(req.query.user_id as string, 10);
    if (isNaN(user_id)) {
        res.status(400).json({ error: 'Invalid user_id parameter' });
        return;
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .select('top_contributor')
            .eq('id', user_id)
            .single();

        if (error || !data) {
            logger.error(`Supabase Error: ${error.message}`);
            throw error || new Error('User not found');
        }

        res.status(200).json({ data: data.top_contributor });
    } catch (e) {
        logger.error(`Error in getTopContributorStatus: ${e}`);
        res.status(500).json({ error: 'Failed to get top_contributor status' });
    }
};
