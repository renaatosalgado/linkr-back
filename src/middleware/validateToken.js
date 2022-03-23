import { authRepository } from '../repositories/authRepository.js';
import { userRepository } from '../repositories/userRepository.js';

export async function validateToken(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');
    if (!token) {
        return res.sendStatus(401);
    }

    const session = await authRepository.getSession(token);
    if (!session) {
        return res.sendStatus(401);
    }

    const user = await userRepository.getUserById(session.rows[0]?.userId);
    if (!user) {
        return res.sendStatus(401);
    }

    res.locals.user = user.rows[0];
    next();
}
