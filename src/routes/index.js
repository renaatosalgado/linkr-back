import { Router } from 'express';
import authRouter from './authRouter.js';
import usersRouter from './usersRouter.js';

const router = Router();

router.use(usersRouter);
router.use(authRouter);

export default router;
