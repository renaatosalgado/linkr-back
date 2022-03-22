import { Router } from 'express';
import { createUser } from '../controllers/usersController.js';
import validateSchemaMiddleware from '../middleware/validateSchemaMiddleware.js';
import userSchema from '../schemas/userSchema.js';

const usersRouter = Router();

usersRouter.post('/sign-up', validateSchemaMiddleware(userSchema), createUser);

export default usersRouter;
