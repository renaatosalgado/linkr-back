import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { authRepository } from "../repositories/authRepository.js";
import { userRepository } from "../repositories/userRepository.js";

export async function login(req, res) {
  const { email, password } = req.body;

  const {
    rows: [user],
  } = await userRepository.getUserByEmail(email);

  if (!user) {
    return res.sendStatus(401);
  }

  if (bcrypt.compareSync(password, user.password)) {
    const token = uuid();
    await authRepository.createSession(token, user.id);

    console.log({ token, user })
    return res.send({ token, user });
  }

  res.sendStatus(401);
}
