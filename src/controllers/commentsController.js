import { commentsRepository } from '../repositories/commentsRepository.js';

export async function createComment(req, res) {
    const { text } = req.body;
    const { id: postId } = req.params;
    const { id: userId } = res.locals.user;

    let commentText = '';

    for (let i = 0; i < text.length; i++) {
        if (text[i] === "'") {
            commentText += '`';
        } else {
            commentText += text[i];
        }
    }

    try {
        await commentsRepository.createComment(commentText, postId, userId);

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

        rows.map((comment) => {
            let commentText = ``;
            for (let i = 0; i < comment.text.length; i++) {
                if (comment.text[i] === '`') {
                    commentText += "'";
                } else {
                    commentText += comment.text[i];
                }
            }
            comment.text = commentText;
        });
        return res.send(rows).status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
