import connection from '../db.js';
import pkg from 'sqlstring';

const { format } = pkg;

async function trends() {
    const query = format(
        `SELECT t.name, COUNT(pt."trendId") AS total 
        FROM trends t
        JOIN "postsTrends" pt ON t.id = pt."trendId"
        GROUP BY t.name
        ORDER BY total DESC
        LIMIT 10`
    );

    return connection.query(query);
}

export const trendsRepository = { trends };
