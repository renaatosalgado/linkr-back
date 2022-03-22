import connection from "../db.js";

async function createUser({ email, passwordHash, username, picture }) {
  return connection.query(
    `
        INSERT INTO users (email, password, name, image)
        VALUES ($1, $2, $3, $4)`,
    [email, passwordHash, username, picture]
  );
}

async function getUserByEmail(email) {
  return connection.query(
    `
        SELECT * FROM users WHERE email = $1`,
    [email]
  );
}

async function getUserById(id) {
  return connection.query(
    `
        SELECT * FROM users WHERE id = $1`,
    [id]
  );
}

export const userRepository = { createUser, getUserByEmail, getUserById };
