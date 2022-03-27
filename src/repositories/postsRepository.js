import connection from '../db.js';

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
    `,
        [description, url, userId, urlTitle, urlDescription, urlImage]
    );
}

async function listAll() {
    return connection.query(`
  SELECT p.*, 
  u.name author, u.image "profilePicture" 
  FROM posts p
  LEFT JOIN users u ON u.id = p."userId"
  ORDER BY p.id 
  DESC
  LIMIT 20
  `);
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
}

async function addHashtagsPost(hashtags,postId){
  try{
    verifyHashtags(hashtags,postId)
  }catch(error){
    console.log(error)
  }   
}

async function userPosts(userId) {
    return connection.query(
        `
    SELECT p.*, 
    u.name author, u.image "profilePicture" 
    FROM posts p
    LEFT JOIN users u ON u.id = p."userId"
    WHERE p."userId" = $1
    ORDER BY p.id 
    DESC
    LIMIT 20
    `,
        [userId]
    );
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

async function deletePost(postId){
  return connection.query(`
    DELETE 
    FROM posts
    WHERE id=$1
  `, [postId])
}

export const postsRepository = { publish, listAll, userPosts, editPost,listHashtag, deletePost,addHashtagsPost };
