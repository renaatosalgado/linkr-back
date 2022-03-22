import { Router } from "express";
import { createPost } from "../controllers/postsController.js";
import validateSchemaMiddleware from "../middleware/validateSchemaMiddleware.js";
import postSchema from "../schemas/postSchema.js";

const postsRouter = Router();

postsRouter.post("/posts", validateSchemaMiddleware(postSchema), createPost);

export default postsRouter;
