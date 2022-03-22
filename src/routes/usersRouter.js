import { Router } from 'express';
import { createUser, login } from '../controllers/usersController.js';
import validateSchemaMiddleware from '../middleware/validateSchemaMiddleware.js';
import userSchema from '../schemas/userSchema.js';
import loginSchema from '../schemas/loginSchema.js';

const usersRouter = Router();

usersRouter.post('/sign-up', validateSchemaMiddleware(userSchema), createUser);
usersRouter.post('/', validateSchemaMiddleware(loginSchema), login);

export default usersRouter;
