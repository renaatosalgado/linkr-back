import connection from "../db.js";

async function createSession(token, userId) {
  return connection.query(
    `
        INSERT INTO sessions (token, "userId")
        VALUES ($1, $2)`,
    [token, userId]
  );
}

async function getSession(token) {
  return connection.query(
    `
        SELECT * FROM sessions WHERE token = $1
    `,
    [token]
  );
}

export const authRepository = { createSession, getSession };
