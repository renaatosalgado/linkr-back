import { Router } from 'express';
import validateSchemaMiddleware from '../middleware/validateSchemaMiddleware.js';
import commentSchema from '../schemas/commentSchema.js';
import { validateToken } from '../middleware/validateToken.js';
import {
    createComment,
    getComments,
} from '../controllers/commentsController.js';

const commentsRouter = Router();

commentsRouter.post(
    '/posts/:id/comments',
    validateToken,
    validateSchemaMiddleware(commentSchema),
    createComment
);

commentsRouter.get('/posts/:id/comments', validateToken, getComments);

export default commentsRouter;
