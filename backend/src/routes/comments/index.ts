import { Request, Response } from 'express';
import { Comment, User } from './types';
const dbClient = require('../../db');
const commentsRouter = require('express').Router();

/**
 * GET /api/comments
 * @summary Fetches all comments from the database for the current date
 * @tags comments
 * @return {Array<Comment>} 200 - An array of comments for the current date, along with the earliest available date and the queried date
 * @return {Error} 400 - Bad request
 * @return {Error} 404 - No comments found for the current date
 * @return {Error} 500 - Internal server error
 */
commentsRouter.get('/', async (req: Request, res: Response) => {
    const date = req.query.date as string;
    if (!date || typeof date !== 'string') {
        return res.status(400).json({ error: 'Missing required parameter: date' });
    }
    try {
        const query = `
            SELECT comments.id, comments.content, comments.user_id, comments.created_at, users.username, users.top_contributor
            FROM comments
            JOIN users ON comments.user_id = users.id
            WHERE comments.created_at::date = $1
            ORDER BY comments.created_at DESC
        `;
        const response = await dbClient.query(query, [date]);
        const comments: Comment[] = response.rows;
        return res.status(200).json(comments);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/comments
 * @summary Adds a comment to the database. Creates a new user if the username does not exist.
 * @tags comments
 * @param {string} body.content.required - The comment to add
 * @param {string} body.username.required - The username of the commenter
 * @return {Comment} 200 - The comment that was added
 * @return {Error} 400 - Bad request
 * @return {Error} 500 - Internal server error
 */

commentsRouter.post('/', async (req: Request, res: Response) => {
    const { content, username } = req.body;
    if (!content || !username || typeof content !== 'string' || typeof username !== 'string') {
        return res.status(400).json({ error: 'Missing required parameter(s): content, username' });
    }
    try {
        const upsertQuery = `INSERT INTO users (username) VALUES ($1) ON CONFLICT DO NOTHING`;
        await dbClient.query(upsertQuery, [username]);

        const userQuery = `SELECT id FROM users WHERE username = $1`;
        const userResponse = await dbClient.query(userQuery, [username]);
        const user: User = userResponse.rows[0];

        const currentDate = new Date().toISOString();
        const query = `INSERT INTO comments (content, user_id, created_at) VALUES ($1, $2, $3) RETURNING *`;
        const response = await dbClient.query(query, [content, user.id, currentDate]);
        const data: Comment = {
            ...response.rows[0],
            username: user.username,
            top_contributor: user.top_contributor
        }
        
        return res.status(200).json(data);
    } catch (e){
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/comments/top-contributor-status
 * @summary Gets the top_contributor status for a user by user_id
 * @tags comments
 * @param {number} query.user_id.required - The user_id to check for top_contributor status
 * @return {boolean} 200 - Whether the user is a top contributor
 * @return {Error} 400 - Bad request
 * @return {Error} 500 - Internal server error
 */
commentsRouter.get('/top-contributor-status', async (req: Request, res: Response) => {
    const { user_id } = req.query;
    if (!user_id || typeof user_id !== 'string') {
        return res.status(400).json({ error: 'Missing required parameter: user_id' });
    }
    try {
        const query = `SELECT top_contributor FROM users WHERE id = $1`;
        const response = await dbClient.query(query, [user_id]);
        const topContributor = response.rows[0].top_contributor;
        return res.status(200).json(topContributor);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = commentsRouter;    