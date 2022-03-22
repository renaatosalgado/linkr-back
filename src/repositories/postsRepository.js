import connection from "../db.js";

async function publish(description, url, userId) {
  return connection.query(
    `
    INSERT INTO posts (description, url, "userId") VALUES ($1, $2, $3)
    `,
    [description, url, userId]
  );
}

export const postsRepository = { publish };
