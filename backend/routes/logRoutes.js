import express from 'express';
const router = express.Router();
import {
  getLogs,
  getLogBySlug,
  createLog,
  updateLog,
  deleteLog,
} from '../controllers/logController.js';

router.route('/').get(getLogs).post(createLog);
router.route('/:slugLog').get(getLogBySlug).put(updateLog).delete(deleteLog);

export default router;
