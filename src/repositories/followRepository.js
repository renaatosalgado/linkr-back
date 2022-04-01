import connection from '../db.js';
import pkg from 'sqlstring';

const { format } = pkg;

async function followUser(followedId, followerId) {
    const query = format(
        `INSERT INTO follows ("followerId", "followedId")
        VALUES (?, ?)`,
        [parseInt(followerId), followedId]
    );
    return connection.query(query);
}

async function isFollowing(followedId, followerId) {
    const query = format(
        `SELECT * FROM follows
        WHERE "followerId" =  ?
        AND "followedId" = ?`,
        [parseInt(followerId), followedId]
    );
    return connection.query(query);
}

async function unFollowUser(followedId, followerId) {
    const query = format(
        `DELETE FROM follows
        WHERE "followerId" =  ?
        AND "followedId" = ?`,
        [parseInt(followerId), followedId]
    );
    return connection.query(query);
}

async function getFollows(id) {
    const query = format(
        `
    SELECT "followedId" FROM follows WHERE "followerId"=?`,
        [id]
    );
    return connection.query(query);
}

async function checkIfUserFollowsSomeone(userId) {
    const query = format(`
      SELECT 
        p.id, p.description, p.url, p."userId", p."urlTitle", p."urlDescription", p."urlImage",
        r.datetime,
        postUser.name AS author,
        postUser.image AS "profilePicture",
        repostUser.name AS "repostedBy"
      FROM reposts r
      JOIN posts p
        ON p.id = r."postId"
      JOIN users postUser
        ON postUser.id = p."userId"
      JOIN users repostUser
        ON repostUser.id = r."repostedByUserId"
      WHERE r."repostedByUserId" IN (
        SELECT
            f."followedId"
        FROM reposts r
        JOIN follows f
            ON f."followedId" = r."repostedByUserId"
        WHERE
            f."followerId" = ?
        )
      UNION
      SELECT 
        p.*,
        u.name author,
        u.image "profilePicture",
        NULL
      FROM posts p
      LEFT JOIN users u
        ON u.id = p."userId"
      LEFT JOIN follows f
        ON f."followedId" = p."userId"
      WHERE f."followerId" = ?
      ORDER BY datetime DESC
      `, [userId, userId]);

    return connection.query(query);
}

export const followRepository = {
    followUser,
    isFollowing,
    unFollowUser,
    getFollows,
    checkIfUserFollowsSomeone,
};
