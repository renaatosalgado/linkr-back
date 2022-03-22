import connection from '../db.js';

async function createSession(token, userId) {
    return connection.query(
        `
        INSERT INTO sessions (token, "userId")
        VALUES ($1, $2)`,
        [token, userId]
    );
}

export const authRepository = { createSession };
