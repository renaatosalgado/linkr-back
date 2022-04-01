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
    const query = format(
        `SELECT c.id, c.text, c."userId" AS "commentUserId", p."userId" AS "postUserId", u.image AS "userImage", u.name AS "userName" 
        FROM comments c
        JOIN posts p ON p.id=c."postId"
        JOIN users u ON u.id=c."userId"
        WHERE c."postId"=?
        ORDER BY c.id ASC`,
        [postId]
    );

    return connection.query(query);
}

async function deleteComments(postId) {
    const query = format(`DELETE FROM comments WHERE "postId"=?`, [postId]);

    return connection.query(query);
}

export const commentsRepository = {
    createComment,
    getComments,
    deleteComments,
};
