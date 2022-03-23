import { Router } from "express";
import { createPost, listPosts } from "../controllers/postsController.js";
import validateSchemaMiddleware from "../middleware/validateSchemaMiddleware.js";
import postSchema from "../schemas/postSchema.js";
import { validateToken } from "../middleware/validateToken.js";
import connection from "../db.js";

const postsRouter = Router();

postsRouter.post(
  "/posts",
  validateToken,
  validateSchemaMiddleware(postSchema),
  createPost
);
postsRouter.get("/posts", validateToken, listPosts);
postsRouter.post("/posts/likes/toogle", validateToken, async (req, res) => {
  const { like } = req.body;
  const { user } = res.locals;

  /*if (like) {
    connection.query(`INSERT INTO likes ("userId", "postId")
    VALUES ($1, $2)`,
      [user.id,]`);
  } else {
    connection.query(``)
  }*/

  res.status(200).send(!req.body.like);
});

export default postsRouter;
