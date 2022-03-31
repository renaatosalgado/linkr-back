import { commentsRepository } from '../repositories/commentsRepository.js';

export async function createComment(req, res) {
    const { text } = req.body;
    const { id: postId } = req.params;
    const { id: userId } = res.locals.user;

    try {
        await commentsRepository.createComment(text, postId, userId);

        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function getComments(req, res) {
    const { id: postId } = req.params;
    try {
        const { rows } = await commentsRepository.getComments(postId);

        return res.send(rows).status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
