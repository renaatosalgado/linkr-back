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
        `INSERT INTO posts (description, url, "userId", "urlTitle", "urlDescription", "urlImage") 
        VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
        [description, url, userId, urlTitle, urlDescription, urlImage]
    );

    return connection.query(query);
}

async function listAll() {
    const query = format(
        `SELECT p.*, 
        u.name author, u.image "profilePicture" 
        FROM posts p
        LEFT JOIN users u ON u.id = p."userId"
        ORDER BY p.id 
        DESC
        LIMIT 20`
    );

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
        [`% #${hashtag} %`]
    );

    return connection.query(query);
}

async function deletePostsTrends(id) {
    const query = format(`DELETE FROM "postsTrends" WHERE "postId"=?`, [id]);

    return connection.query(query);
}

async function editPost(description, id, hashtags) {
    const query = format(
        `UPDATE posts
        SET description = ?
        WHERE id=?`,
        [description, id]
    );

    await deletePostsTrends(id);

    verifyHashtags(hashtags, id);

    return connection.query(query);
}

async function addHashtagsPost(hashtags, postId) {
    try {
        verifyHashtags(hashtags, postId);
    } catch (error) {
        console.log(error);
    }
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

async function verifyHashtags(hashtags, postId) {
    const trends = await getTrends();

    for (let i = 0; i < hashtags.length; i++) {
        for (let j = 0; j < trends.rows.length; j++) {
            if (hashtags[i] === trends.rows[j].name) {
                await insertPostsTrend(trends.rows[j].id, postId);
                break;
            }
            if (j === trends.rows.length - 1) {
                const hashtagId = await insertTrendsHashtag(hashtags[i]);

                await insertPostsTrend(hashtagId.rows[0].id, postId);
            }
        }
    }
}

async function deletePostsTrends(postId) {
    const query = format(`DELETE FROM "postsTrends" WHERE "postId"=?`, [
        postId,
    ]);

    return connection.query(query);
}

async function deletePost(postId) {
    const query = format(`DELETE FROM posts WHERE id=?`, [postId]);

    await deletePostsTrends(postId);

    return connection.query(query);
}

export const postsRepository = {
    publish,
    listAll,
    userPosts,
    editPost,
    listHashtag,
    deletePost,
    addHashtagsPost,
};
