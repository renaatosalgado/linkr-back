import { Router } from 'express';
import {listTrends} from '../controllers/trendsController.js'

const trendsRouter = Router();

trendsRouter.get('/trends', listTrends);

export default trendsRouter;
