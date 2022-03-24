import connection from "../db.js";

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
    INSERT INTO posts (description, url, "userId", "urlTitle", "urlDescription", "urlImage") VALUES ($1, $2, $3, $4, $5, $6)
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

async function editPost(description, id) {
  return connection.query(
    `
  UPDATE posts
  SET description = $1 
  WHERE id=$2
  `,
    [description, id]
  );
}

export const postsRepository = { publish, listAll, editPost };
