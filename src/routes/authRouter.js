import { Router } from 'express';
import { login, logout } from '../controllers/authController.js';
import validateSchemaMiddleware from '../middleware/validateSchemaMiddleware.js';
import { validateToken } from '../middleware/validateToken.js';
import loginSchema from '../schemas/loginSchema.js';

const authRouter = Router();

authRouter.post('/', validateSchemaMiddleware(loginSchema), login);
authRouter.delete('/logout', validateToken, logout);

export default authRouter;
