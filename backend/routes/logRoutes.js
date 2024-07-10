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

router.route('/').get(getLogs).post(createLog);
router.route('/:slugLog').get(getLogBySlug).delete(deleteLog);
router.route('/edit/:id').get(getLogById).put(updateLogId);

export default router;
