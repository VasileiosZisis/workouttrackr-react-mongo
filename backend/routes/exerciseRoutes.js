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
import {
  validateExercise,
  validateUpdateExercise,
} from '../middleware/validations.js';
import {
  isExerciseAuthor,
  isExerciseByIdAuthor,
} from '../middleware/authorMiddleware.js';

router.route('/').post(registered, validateExercise, createExercise);
router
  .route('/:slugExercise')
  .get(registered, isExerciseAuthor, getExerciseBySlug)
  .delete(registered, isExerciseAuthor, deleteExercise);
router
  .route('/edit/:exerciseId')
  .get(
    registered,
    isExerciseByIdAuthor,
    checkObjectId('exerciseId'),
    getExerciseById
  )
  .put(
    registered,
    isExerciseByIdAuthor,
    validateUpdateExercise,
    updateExerciseId
  );

export default router;
