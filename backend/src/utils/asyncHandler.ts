

import { Request, Response, NextFunction, RequestHandler } from 'express';

// A utility function to handle asynchronous route handlers and catch any errors.
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
