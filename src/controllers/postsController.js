import { postsRepository } from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";

export async function createPost(req, res) {
  const { url, description } = req.body;
  const user = res.locals.user;

  let urlTitle = "";
  let urlDescription = "";
  let urlImage = "";

  try {
    const metadata = await urlMetadata(url);
    urlTitle = metadata.title;
    urlDescription = metadata.description;
    urlImage = metadata.image;

    await postsRepository.publish(
      description,
      url,
      user.id,
      urlTitle,
      urlDescription,
      urlImage    
    );

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function listPosts(req, res) {
  try {
    const result = await postsRepository.listAll();

    res.status(200).send(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
