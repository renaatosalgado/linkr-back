import { userRepository } from '../repositories/userRepository';

export async function validateToken(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');
    if (!token) {
        return res.sendStatus(401);
    }

    const session = await userRepository;
    if (!session) {
        return res.sendStatus(401);
    }

    const user = await userRepository;
    if (!user) {
        return res.sendStatus(401);
    }

    res.locals.user = user;
    next();
}
