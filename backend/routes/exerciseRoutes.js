import express from 'express';
const router = express.Router({ mergeParams: true });
import {
  createExercise,
  getExerciseBySlug,
  getExerciseById,
  updateExerciseId,
  deleteExercise,
} from '../controllers/exerciseController.js';

router.route('/').post(createExercise);
router.route('/:slugExercise').get(getExerciseBySlug).delete(deleteExercise);
router.route('/edit/:exerciseId').get(getExerciseById).put(updateExerciseId);

export default router;
