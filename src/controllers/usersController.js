import { userRepository } from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';

export async function createUser(req, res) {
    const newUser = req.body;
    const passwordHash = bcrypt.hashSync(newUser.password, 10);

    try {
        const user = await userRepository.getUser(newUser.email);

        if (user.rowCount !== 0) {
            return res.sendStatus(409);
        }

        await userRepository.createUser({ ...newUser, passwordHash });

        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
