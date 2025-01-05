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
import { isExerciseAuthor } from '../middleware/authorMiddleware.js';

router.route('/').post(registered, validateExercise, createExercise);
router
  .route('/:slugExercise')
  .get(registered, isExerciseAuthor, getExerciseBySlug)
  .delete(registered, isExerciseAuthor, deleteExercise);
router
  .route('/edit/:exerciseId')
  .get(checkObjectId, registered, isExerciseAuthor, getExerciseById)
  .put(registered, isExerciseAuthor, validateExercise, updateExerciseId);

export default router;
