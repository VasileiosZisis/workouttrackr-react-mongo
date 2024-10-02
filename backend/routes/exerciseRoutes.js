import express from 'express';
const router = express.Router({ mergeParams: true });
import {
  createExercise,
  getExerciseBySlug,
  getExerciseById,
  updateExerciseId,
  deleteExercise,
} from '../controllers/exerciseController.js';
import { registered } from '../middleware/loginMiddleware.js';

router.route('/').post(registered, createExercise);
router
  .route('/:slugExercise')
  .get(registered, getExerciseBySlug)
  .delete(registered, deleteExercise);
router
  .route('/edit/:exerciseId')
  .get(registered, getExerciseById)
  .put(registered, updateExerciseId);

export default router;
