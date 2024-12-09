import { Router } from 'express';
const router = Router();

router.get('/songs', (req, res) => {
  res.json([{ id: 1, title: 'Song 1', artist: 'Artist 1' }]);
});

export default router;
