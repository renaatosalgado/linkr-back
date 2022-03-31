import { Router } from 'express';
import {
    toggleFollow,
    checkIfFollow,
    getFollows,
} from '../controllers/followController.js';
import { validateToken } from '../middleware/validateToken.js';

const followRouter = Router();

followRouter.post('/:followId/follow', validateToken, toggleFollow);
followRouter.get('/is-follow/:followId', validateToken, checkIfFollow);
followRouter.get('/follows', validateToken, getFollows);

export default followRouter;
