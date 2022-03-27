import { postsRepository } from '../repositories/postsRepository.js';
import urlMetadata from 'url-metadata';
import { userRepository } from '../repositories/userRepository.js';

export async function createPost(req, res) {
    const { url, description } = req.body;
    const user = res.locals.user;
    const descriptionWords = description.split(' ');

    let hashtags = [];
    let urlTitle = '';
    let urlDescription = '';
    let urlImage = '';
    
    for(let i = 0; i<descriptionWords.length; i++) {
      if(descriptionWords[i][0] === "#" && !hashtags.includes(descriptionWords[i])){
        hashtags.push(descriptionWords[i])
      }
    }

    try {
        const metadata = await urlMetadata(url);
        urlTitle = metadata.title;
        urlDescription = metadata.description;
        urlImage = metadata.image;

        const postId = await postsRepository.publish(
            description,
            url,
            user.id,
            urlTitle,
            urlDescription,
            urlImage
        );
        await postsRepository.addHashtagsPost(hashtags,postId.rows[0].id)
        res.sendStatus(201);
    } catch (error) {
      console.log(error)
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

export async function listUserPosts(req, res) {
    const { id: userId } = req.params;
    try {
        const { rows: posts } = await postsRepository.userPosts(userId);
        const {
            rows: [user],
        } = await userRepository.getUserById(userId);
        const authorName = user.name;

        res.status(200).send({ posts: [...posts], authorName });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function editPost(req, res) {
  const { id } = req.params;
  const { description } = req.body;
  const descriptionWords = description.split(' ');
  let hashtags = [];
  for(let i = 0; i<descriptionWords.length; i++) {
    if(descriptionWords[i][0] === "#" && !hashtags.includes(descriptionWords[i])){
      hashtags.push(descriptionWords[i])
    }
  }
  try {
    await postsRepository.editPost(description, id,hashtags);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getHashtagPost(req, res) {
  const {hashtag} = req.params;
  try {
    const result = await postsRepository.listHashtag(hashtag);

    res.status(200).send(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
