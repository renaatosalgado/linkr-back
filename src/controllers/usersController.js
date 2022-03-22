import { userRepository } from '../repositories/userRepository.js';

export async function createUser(req, res) {
    try {
        const user = await userRepository.getUser(req.body);

        if (user.rowCount !== 0) {
            return res.sendStatus(409);
        }

        await userRepository.createUser(req.body);

        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function login(req, res) {
    try {
        const user = await userRepository.getUser(req.body);
        if (user.rowCount === 0) {
            return res.sendStatus(404);
        }

        return res.send(user.rows);
    } catch {
        return res.sendStatus(500);
    }
}
