import express from 'express';
const router = express.Router();
import {
  getLogs,
  getLogBySlug,
  createLog,
  updateLog,
  getLogById,
  updateLogId,
} from '../controllers/logController.js';

router.route('/').get(getLogs).post(createLog);
router.route('/:slugLog').get(getLogBySlug).put(updateLog);
router.route('/edit/:id').get(getLogById).put(updateLogId);

export default router;
