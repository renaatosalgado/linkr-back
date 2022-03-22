
import { Router } from 'express';
import authRouter from './authRouter.js';
import usersRouter from './usersRouter.js';
import postsRouter from "./postsRouter.js";


const router = Router();
router.use(usersRouter);
router.use(authRouter);
router.use(postsRouter)


export default router;
