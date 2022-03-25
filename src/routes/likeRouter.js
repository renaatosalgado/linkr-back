import { Router } from "express";
import { checkLikeUser, getTwoNamesThatLiked, toggleLike, totalLike } from "../controllers/likesController.js";

const likeRouter = Router();

likeRouter.post("/toggle", toggleLike);
likeRouter.get("/:postId/total", totalLike);
likeRouter.get("/:postId", checkLikeUser);
likeRouter.get("/:postId/two-names", getTwoNamesThatLiked);

export default likeRouter;