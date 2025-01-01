import express from 'express';
const router = express.Router({ mergeParams: true });
import {
  createExercise,
  getExerciseBySlug,
  getExerciseById,
  updateExerciseId,
  deleteExercise,
} from '../controllers/exerciseController.js';
import checkObjectId from '../middleware/checkObjectId.js';
import { registered } from '../middleware/loginMiddleware.js';
import { validateExercise } from '../middleware/validations.js';

router.route('/').post(registered, validateExercise, createExercise);
router
  .route('/:slugExercise')
  .get(registered, getExerciseBySlug)
  .delete(registered, deleteExercise);
router
  .route('/edit/:exerciseId')
  .get(registered, checkObjectId, getExerciseById)
  .put(registered, validateExercise, updateExerciseId);

export default router;
