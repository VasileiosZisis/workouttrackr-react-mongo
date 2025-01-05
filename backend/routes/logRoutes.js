import express from 'express';
const router = express.Router();
import {
  getLogs,
  getLogBySlug,
  createLog,
  getLogById,
  updateLogId,
  deleteLog,
} from '../controllers/logController.js';
import checkObjectId from '../middleware/checkObjectId.js';
import { registered } from '../middleware/loginMiddleware.js';
import { validateLog } from '../middleware/validations.js';
import { isLogAuthor } from '../middleware/authorMiddleware.js';

router
  .route('/')
  .get(registered, getLogs)
  .post(registered, validateLog, createLog);
router
  .route('/:slugLog')
  .get(registered, isLogAuthor, getLogBySlug)
  .delete(registered, isLogAuthor, deleteLog);
router
  .route('/edit/:id')
  .get(checkObjectId, registered, isLogAuthor, getLogById)
  .put(registered, isLogAuthor, validateLog, updateLogId);

export default router;
