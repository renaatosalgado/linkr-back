import connection from '../db.js';

async function trends(){
    return connection.query(`
        SELECT t.name, COUNT(pt."trendId") AS total FROM trends t
        JOIN "postsTrends" pt ON t.id = pt."trendId"
        GROUP BY t.name
        ORDER BY total DESC
        LIMIT 10
        `
    )

}

export const trendsRepository = {trends}