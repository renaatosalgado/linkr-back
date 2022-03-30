import connection from '../db.js';
import pkg from 'sqlstring';

const { format } = pkg;

async function followUser(followerId, followedId) {

    const query = format(
        `INSERT INTO follows ("followerId", "followedId")
        VALUES (?, ?)`,
        [parseInt(followerId), followedId]
    );
    return connection.query(query);
}

async function isFollowing(followerId, followedId) {
    const query = format(
        `SELECT * FROM follows
        WHERE "followerId" =  ?
        AND "followedId" = ?`,
        [parseInt(followerId), followedId]
    );
    return connection.query(query);
}

async function unFollowUser(followerId, followedId){
    const query = format(
        `DELETE FROM follows
        WHERE "followerId" =  ?
        AND "followedId" = ?`,
        [parseInt(followerId), followedId]
    );
    return connection.query(query);
}


export const followRepository = { followUser, isFollowing, unFollowUser };
