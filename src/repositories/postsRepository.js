import connection from '../db.js';
import pkg from 'sqlstring';

const { format } = pkg;

async function publish(
    description,
    url,
    userId,
    urlTitle,
    urlDescription,
    urlImage
) {
    const query = format(
        `INSERT INTO posts (description, url, "userId", "urlTitle", "urlDescription", "urlImage", datetime)
        VALUES (?,?,?,?,?,?,?) RETURNING id`,
        [description, url, userId, urlTitle, urlDescription, urlImage, Date.now()]
    );

    return connection.query(query);
}

async function listAll(userId, lastPostId) {
    
    let whereP = "";
    let whereR = "";
  let limit = `LIMIT 10`;
  if(lastPostId) {
    whereP = `AND p.datetime > '${lastPostId}'`
    whereR = `AND r.datetime > '${lastPostId}'`
    limit = `LIMIT 100`;
  
}
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
        ) ${whereR}
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
    WHERE f."followerId" = ? ${whereP}
    ORDER BY datetime DESC
    ${limit}
    `, [userId, userId])
 
    return connection.query(query);
}

async function listHashtag(hashtag) {
    const query = format(
        `SELECT p.*, 
        u.name author, u.image "profilePicture" 
        FROM posts p
        LEFT JOIN users u ON u.id = p."userId"
        WHERE p.description LIKE ?
        ORDER BY p.id 
        DESC
        LIMIT 20`,
        [`%#${hashtag}%`]
    );

    return connection.query(query);
}

async function deletePostsTrends(id) {
    const query = format(`DELETE FROM "postsTrends" WHERE "postId"=?`, [id]);

    return connection.query(query);
}

async function editPost(description, id) {
    const query = format(
        `UPDATE posts
        SET description = ?
        WHERE id=?`,
        [description, id]
    );

    return connection.query(query);
}

async function userPosts(userId) {
    const query = format(
        `SELECT p.*, 
        u.name author, u.image "profilePicture" 
        FROM posts p
        LEFT JOIN users u ON u.id = p."userId"
        WHERE p."userId" = ?
        ORDER BY p.id 
        DESC
        LIMIT 20`,
        [userId]
    );

    return connection.query(query);
}

async function getTrends() {
    const query = format(`SELECT * FROM trends`);

    return connection.query(query);
}

async function insertPostsTrend(trendId, postId) {
    const query = format(
        `INSERT INTO "postsTrends" ("trendId","postId") VALUES (?,?)`,
        [trendId, postId]
    );
    return connection.query(query);
}

async function insertTrendsHashtag(hashtag) {
    const query = format(`INSERT INTO trends (name) VALUES (?) RETURNING id`, [
        hashtag,
    ]);

    return connection.query(query);
}

async function deletePost(postId) {
    const query = format(`DELETE FROM posts WHERE id=?`, [postId]);

    return connection.query(query);
}

async function rePost(userId ,postId){
    const query = format(`INSERT INTO reposts ("repostedByUserId", "postId", datetime) VALUES (?,?,?)`, [userId, postId, Date.now()]);

    return connection.query(query)
}

export const postsRepository = {
    publish,
    listAll,
    userPosts,
    editPost,
    listHashtag,
    deletePost,
    deletePostsTrends,
    getTrends,
    insertPostsTrend,
    insertTrendsHashtag,
    rePost,
};
