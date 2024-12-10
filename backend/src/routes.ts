import { Router } from 'express';
import { getRandomSongs } from './controllers/songController';
const router = Router();

router.get('/api/songs', getRandomSongs);

export default router;
