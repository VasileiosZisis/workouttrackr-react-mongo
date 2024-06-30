import express from 'express';
const router = express.Router();
import {
  getLogs,
  getLogById,
  createLog,
  updateLog,
  deleteLog,
} from '../controllers/logController.js';

router.route('/').get(getLogs).post(createLog);
router.route('/:id').get(getLogById).put(updateLog).delete(deleteLog);

export default router;
