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
  SELECT * FROM posts 
  ORDER BY id 
  DESC
  LIMIT 20
  `);
}

export const postsRepository = { publish, listAll };
