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
    return connection.query(
        `
    INSERT INTO posts (description, url, "userId", "urlTitle", "urlDescription", "urlImage") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `,[description, url, userId, urlTitle, urlDescription, urlImage])
    // const query = format(
    //     `INSERT INTO posts (description, url, "userId", "urlTitle", "urlDescription", "urlImage") 
    //     VALUES (?, ?, ?, ?, ?, ?)`,
    //     [description, url, userId, urlTitle, urlDescription, urlImage]
    // );
    // return connection.query(query);
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
  return connection.query(`
  SELECT p.*, 
  u.name author, u.image "profilePicture" 
  FROM posts p
  LEFT JOIN users u ON u.id = p."userId"
  WHERE p.description LIKE $1
  ORDER BY p.id 
  DESC
  LIMIT 20
  `,[`% #${hashtag} %`]);
}



async function editPost(description, id,hashtags) {
  await connection.query(`DELETE FROM "postsTrends" WHERE "postId"=$1`,[id])

  verifyHashtags(hashtags,id)
  return connection.query(
  `
  UPDATE posts
  SET description = $1 
  WHERE id=$2
  `,
    [description, id]
  );
    // const query = format(
    //     `SELECT p.*, 
    //     u.name author, u.image "profilePicture" 
    //     FROM posts p
    //     LEFT JOIN users u ON u.id = p."userId"
    //     WHERE p.description LIKE ?
    //     ORDER BY p.id 
    //     DESC
    //     LIMIT 20`,
    //     [`%#${hashtag}%`]
    // );
    // return connection.query(query);
}

// async function editPost(description, id) {
//     const query = format(
//         `UPDATE posts
//         SET description = ?
//         WHERE id=?`,
//         [description, id]
//     );
//     return connection.query(query);
// }

async function addHashtagsPost(hashtags,postId){
  console.log(postId);
  try{
    verifyHashtags(hashtags,postId)
  }catch(error){
    console.log(error)
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

async function verifyHashtags(hashtags,postId){
  const trends = await connection.query(`SELECT * FROM trends`);
    
  for(let i = 0; i < hashtags.length; i++){
    for(let j = 0; j < trends.rows.length; j++){
      if(hashtags[i] === trends.rows[j].name){
        await connection.query(`INSERT INTO "postsTrends" ("trendId","postId") VALUES ($1,$2)`, [trends.rows[j].id,postId])
        break;
      }
      if(j === trends.rows.length-1){
        const hashtagId = await connection.query(`INSERT INTO trends (name) VALUES ($1) RETURNING id`,[hashtags[i]])
        await connection.query(`INSERT INTO "postsTrends" ("trendId","postId") VALUES ($1,$2)`, [hashtagId.rows[0].id,postId])
      }
    }
  }
}

async function deletePost(postId) {
  await connection.query(`DELETE FROM "postsTrends" WHERE "postId"=$1`,[postId])
    const query = format(
        `DELETE 
        FROM posts
        WHERE id=?`,
        [postId]
    );

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
