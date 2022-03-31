import { Router } from 'express';
import { toggleFollow, checkIfFollow } from '../controllers/followController.js'
import connection from '../db.js';
import { validateToken } from '../middleware/validateToken.js';

const followRouter = Router();

followRouter.post('/:followId/follow', validateToken, toggleFollow);
followRouter.get('/is-follow/:followId', validateToken, checkIfFollow);
followRouter.get('/is-follow-user/:userId', async (req, res) => {
  const { userId } = req.params;

  const { rows: followedRows } = await connection.query(`
    SELECT * FROM follows WHERE "followerId" = $1
  `, [userId])

  if (followedRows.length === 0) {
    return res.status(200).json({ message: `You still don't follow anyone. Look for new friends!`, status: 1 })
  }

  const { rows: postRows } = await connection.query(`
    SELECT 
      p.id, p.description, p.url, p."userId", p."urlTitle", p."urlDescription", p."urlImage",
      r.datetime,
      postUser.name AS author,
      postUser.image AS "profilePicture",
      repostUser.name AS "repostedBy"
    FROM reposts r
    JOIN posts p
      ON p.id = r."postId"
    JOIN users postUser
      ON postUser.id = p."userId"
    JOIN users repostUser
      ON repostUser.id = r."repostedByUserId"
    WHERE r."repostedByUserId" IN (
      SELECT
          f."followedId"
      FROM reposts r
      JOIN follows f
          ON f."followedId" = r."repostedByUserId"
      WHERE
          f."followerId" = $1
      )
    UNION
    SELECT 
      p.*,
      u.name author,
      u.image "profilePicture",
      NULL
    FROM posts p
    LEFT JOIN users u
      ON u.id = p."userId"
    LEFT JOIN follows f
      ON f."followedId" = p."userId"
    WHERE f."followerId" = $2
    ORDER BY datetime DESC
    `, [userId, userId])

  if (postRows.length === 0) {
    return res.status(200).json({ message: 'No posts found from your friends', status: 2 })
  }

  return res.status(200).json({ message: 'OK', status: postRows.length })
});

export default followRouter;
