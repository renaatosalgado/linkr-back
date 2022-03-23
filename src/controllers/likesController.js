import { userRepository } from "../repositories/userRepository.js";
import { likeRepositoy } from "../repositories/likeRepositoy.js";

export async function toogleLike(req, res) {
  try {
    const { like, postId } = req.body;
    const { user: userLocals } = res.locals;

    const { rows: userRows } = await userRepository.getUserById(userLocals.id);

    if (userRows.length === 0) {
      return res.sendStatus(404).send('User not found');
    }

    const [user] = userRows;

    if (!like) {
      await likeRepositoy.insertLike(user.id, postId);
    } else {
      await likeRepositoy.removeLike(user.id, postId);
    }

    return res.status(200).send(!req.body.like);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function totalLike(req, res) {
  try {
    const { postId } = req.params;
    const { rows } = await likeRepositoy.totalLike(postId);

    if (rows.length === 0) {
      return res.sendStatus(404).send('Post id not found');
    }

    res.status(200).send(rows[0].total);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function checkLikeUser(req, res) {
  try {
    const { postId } = req.params;
    const { user: userLocals } = res.locals;

    const { rows: userRows } = await userRepository.getUserById(userLocals.id);

    if (userRows.length === 0) {
      return res.sendStatus(404).send('User not found');
    }

    const [user] = userRows;

    const { rows: likeRows } = await likeRepositoy.checkLike(user.id, postId);

    if (likeRows.length === 0) {
      return res.status(200).send(false)
    } else {
      return res.status(200).send(true);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}