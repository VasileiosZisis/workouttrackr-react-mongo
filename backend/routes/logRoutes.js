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

router
  .route('/')
  .get(registered, getLogs)
  .post(registered, validateLog, createLog);
router
  .route('/:slugLog')
  .get(registered, getLogBySlug)
  .delete(registered, deleteLog);
router
  .route('/edit/:id')
  .get(registered, checkObjectId, getLogById)
  .put(registered, validateLog, updateLogId);

export default router;
