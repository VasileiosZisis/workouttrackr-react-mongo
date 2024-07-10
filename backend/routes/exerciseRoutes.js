import express from 'express';
const router = express.Router();
import { createExercise } from '../controllers/exerciseController.js';

router.route('/').post(createExercise);
// router.route('/:slugLog').get(getLogBySlug).delete(deleteLog);
// router.route('/edit/:id').get(getLogById).put(updateLogId);

export default router;
