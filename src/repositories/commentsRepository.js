import connection from '../db.js';
import pkg from 'sqlstring';

const { format } = pkg;

async function createComment(text, postId, userId) {
    const query = format(
        `INSERT INTO comments (text, "postId", "userId")
        VALUES (?, ?, ?)`,
        [text, postId, userId]
    );

    return connection.query(query);
}

async function getComments(postId) {
    const query = format(`SELECT * FROM comments WHERE "postId"=?`, [postId]);

    return connection.query(query);
}

export const commentsRepository = {
    createComment,
    getComments,
};
