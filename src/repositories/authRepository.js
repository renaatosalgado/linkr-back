import connection from '../db.js';
import pkg from 'sqlstring';

const { format } = pkg;

async function createSession(token, userId) {
    const query = format(
        `INSERT INTO sessions (token, "userId")
        VALUES (?, ?)`,
        [token, userId]
    );

    return connection.query(query);
}

async function getSession(token) {
    const query = format(`SELECT * FROM sessions WHERE token = ?`, [token]);

    return connection.query(query);
}

async function deleteSession(userId) {
    const query = format(`DELETE FROM sessions WHERE "userId"=?`, [userId]);

    return connection.query(query);
}

export const authRepository = { createSession, getSession, deleteSession };
