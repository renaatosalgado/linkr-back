import { Router } from 'express';
import { createUser, searchUser } from '../controllers/usersController.js';
import validateSchemaMiddleware from '../middleware/validateSchemaMiddleware.js';
import { validateToken } from '../middleware/validateToken.js';
import userSchema from '../schemas/userSchema.js';

const usersRouter = Router();

usersRouter.post('/sign-up', validateSchemaMiddleware(userSchema), createUser);
usersRouter.get("/users", searchUser)

export default usersRouter;
