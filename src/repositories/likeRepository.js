import connection from "../db.js";

async function insertLike(userId, postId) {
  return connection.query(`INSERT INTO likes ("userId", "postId")
    VALUES ($1, $2)`,
    [userId, postId]);
}

async function removeLike(userId, postId) {
  return connection.query(`DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2`,
    [userId, postId]);
}

async function totalLike(postId) {
  return connection.query(`SELECT COUNT(DISTINCT "userId") total FROM likes WHERE "postId" = $1`, [postId]);
}

async function checkLike(userId, postId) {
  return connection.query(`SELECT * FROM likes WHERE "userId" = $1 AND "postId" = $2`,
    [userId, postId]);
}

async function getTwoNamesThatLiked(userId, postId) {
  return connection.query(`SELECT u.name FROM likes l
    LEFT JOIN users u ON u.id = l."userId"
    LEFT JOIN posts p ON p.id = l."postId"
    WHERE l."postId" = $1 AND l."userId" != $2
    ORDER BY l."userId" ASC
    LIMIT 2`,
    [postId, userId]);
}

async function deleteLikes(postId){
  return connection.query(`
  DELETE 
  FROM likes
  WHERE "postId" = $1
  `,[postId])
}

export const likeRepositoy = { insertLike, removeLike, totalLike, checkLike, getTwoNamesThatLiked, deleteLikes };