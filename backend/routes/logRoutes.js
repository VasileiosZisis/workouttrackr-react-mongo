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
import { registered } from '../middleware/loginMiddleware.js';

router.route('/').get(registered, getLogs).post(registered, createLog);
router
  .route('/:slugLog')
  .get(registered, getLogBySlug)
  .delete(registered, deleteLog);
router
  .route('/edit/:id')
  .get(registered, getLogById)
  .put(registered, updateLogId);

export default router;
