// src/app.ts

import express from 'express';
import bodyParser from 'body-parser';
import songRouter from './routes/songs';
import commentsRouter from './routes/comments';
import logger from './utils/logger';
import cors from 'cors'
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // If you need to send cookies or authentication headers
}));

// Routes
app.use('/api/songs', songRouter);
app.use('/api/comments', commentsRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
export default app;