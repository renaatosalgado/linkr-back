import { Router } from "express";
import { validateToken } from "../middleware/validateToken.js";
import { checkLikeUser, toogleLike, totalLike } from "../controllers/likesController.js";

const likeRouter = Router();

likeRouter.post("/likes/toogle", validateToken, toogleLike);
likeRouter.get("/likes/:postId/total", totalLike);
likeRouter.get("/likes/:postId", validateToken, checkLikeUser);

export default likeRouter;