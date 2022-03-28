import connection from '../db.js';
import pkg from 'sqlstring';

const { format } = pkg;

async function insertLike(userId, postId) {
    const query = format(
        `INSERT INTO likes ("userId", "postId")
         VALUES (?, ?)`,
        [userId, postId]
    );

    return connection.query(query);
}

async function removeLike(userId, postId) {
    const query = format(
        `DELETE FROM likes WHERE "userId" = ? AND "postId" = ?`,
        [userId, postId]
    );

    return connection.query(query);
}

async function totalLike(postId) {
    const query = format(
        `SELECT COUNT(DISTINCT "userId") total FROM likes WHERE "postId" = ?`,
        [postId]
    );
    return connection.query(query);
}

async function checkLike(userId, postId) {
    const query = format(
        `SELECT * FROM likes WHERE "userId" = ? AND "postId" = ?`,
        [userId, postId]
    );
    return connection.query(query);
}

async function getTwoNamesThatLiked(userId, postId) {
    const query = format(
        `SELECT u.name FROM likes l
        LEFT JOIN users u ON u.id = l."userId"
        LEFT JOIN posts p ON p.id = l."postId"
        WHERE l."postId" = ? AND l."userId" != ?
        ORDER BY l."userId" ASC
        LIMIT 2`,
        [postId, userId]
    );
    return connection.query(query);
}

async function deleteLikes(postId) {
    const query = format(
        `DELETE FROM likes
        WHERE "postId" = ?`,
        [postId]
    );

    return connection.query(query);
}

export const likeRepositoy = {
    insertLike,
    removeLike,
    totalLike,
    checkLike,
    getTwoNamesThatLiked,
    deleteLikes,
};
