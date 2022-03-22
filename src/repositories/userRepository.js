import connection from '../db.js';

async function createUser({ email, password, username, picture }) {
    return connection.query(
        `
        INSERT INTO users (email, password, name, image)
        VALUES ($1, $2, $3, $4)`,
        [email, password, username, picture]
    );
}

async function getUser({ email }) {
    return connection.query(
        `
        SELECT * FROM users WHERE email = $1`,
        [email]
    );
}

export const userRepository = { createUser, getUser };
