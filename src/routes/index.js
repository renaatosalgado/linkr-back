import { Router } from "express";
import usersRouter from "./usersRouter.js";
import postsRouter from "./postsRouter.js";

const router = Router();
router.use(usersRouter);
router.use(postsRouter)

export default router;
