import { Router } from 'express';
import authRouter from './authRouter.js';
import usersRouter from './usersRouter.js';
import postsRouter from './postsRouter.js';
import likeRouter from './likeRouter.js';
import trendsRouter from './trendsRouter.js';
import commentsRouter from './commentsRouter.js';
import followRouter from "./followRouter.js";

import { validateToken } from '../middleware/validateToken.js';

const router = Router();
router.use(usersRouter);
router.use(authRouter);
router.use(postsRouter);
router.use('/likes', validateToken, likeRouter);
router.use(trendsRouter);
router.use(commentsRouter);
router.use(followRouter);

export default router;
