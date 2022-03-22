import { postsRepository } from "../repositories/postsRepository.js";

export async function createPost(req, res) {
  const { url, description } = req.body;
  const user = res.locals.user;

  try {
    await postsRepository.publish(description, url, user.id);

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
}
