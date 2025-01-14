import express from 'express';

import queue from './queue'

const router = express.Router();

router.use('/queue', queue)

export default router;
