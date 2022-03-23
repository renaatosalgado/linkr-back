import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { authRepository } from '../repositories/authRepository.js';
import { userRepository } from '../repositories/userRepository.js';

export async function login(req, res) {
    const { email, password } = req.body;
    try {
        const {
            rows: [user],
        } = await userRepository.getUserByEmail(email);

        if (!user) {
            return res.sendStatus(401);
        }

        if (bcrypt.compareSync(password, user.password)) {
            const token = uuid();
            await authRepository.createSession(token, user.id);

            delete user.password;

            return res.send({ token, user });
        }

        return res.sendStatus(401);
    } catch {
        return res.sendStatus(500);
    }
}

export async function logout(req, res) {
    const { user } = res.locals;
    try {
        await authRepository.deleteSession(user.id);

        return res.sendStatus(200);
    } catch {
        return res.sendStatus(500);
    }
}
