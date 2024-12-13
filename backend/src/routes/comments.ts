// src/routes/comments.ts

import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getComments, addComment, getTopContributorStatus } from '../controllers/commentController';

const commentsRouter = Router();

/**
 * GET /api/comments
 * @summary Fetches all comments from the database for the given date
 * @tags comments
 * @param {string} query.date.required - The date to fetch comments for (YYYY-MM-DD)
 * @return {object} 200 - An object containing an array of comments for the given date
 * @return {object} 400 - Bad request
 * @return {object} 500 - Internal server error
 */
commentsRouter.get('/', asyncHandler(getComments));

/**
 * POST /api/comments
 * @summary Adds a comment to the database. Creates a new user if the username does not exist.
 * @tags comments
 * @param {object} body - The comment to add
 * @param {string} body.content.required - The comment text
 * @param {string} body.username.required - The username of the commenter
 * @param {number} body.songId - The ID of the song to comment on
 * @return {object} 201 - The comment that was added
 * @return {object} 400 - Bad request
 * @return {object} 500 - Internal server error
 */
commentsRouter.post('/', asyncHandler(addComment));

/**
 * GET /api/comments/top-contributor-status
 * @summary Gets the top_contributor status for a user by user_id
 * @tags comments
 * @param {number} query.user_id.required - The user_id to check for top_contributor status
 * @return {object} 200 - An object containing the top_contributor status
 * @return {object} 400 - Bad request
 * @return {object} 500 - Internal server error
 */
commentsRouter.get('/top-contributor-status', asyncHandler(getTopContributorStatus));

export default commentsRouter;
