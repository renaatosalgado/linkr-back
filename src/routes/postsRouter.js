import { Router } from 'express';
import {
    createPost,
    listPosts,
    listUserPosts,
    editPost,
    getHashtagPost,
    deletePost,
    rePost,
} from '../controllers/postsController.js';
import validateSchemaMiddleware from '../middleware/validateSchemaMiddleware.js';
import postSchema from '../schemas/postSchema.js';
import { validateToken } from '../middleware/validateToken.js';

const postsRouter = Router();

postsRouter.post(
  "/posts",
  validateToken,
  validateSchemaMiddleware(postSchema),
  createPost
);
postsRouter.get("/posts", validateToken, listPosts);
postsRouter.get("/posts/hashtag/:hashtag", getHashtagPost);
postsRouter.put("/posts/:id", validateToken, editPost);
postsRouter.get('/user/:id', validateToken, listUserPosts);
postsRouter.delete('/posts/:id', validateToken, deletePost);
postsRouter.post('/posts/:id/repost', validateToken, rePost);
postsRouter.get("/posts/update/:lastPostDatetime", validateToken, listPosts);

export default postsRouter;
