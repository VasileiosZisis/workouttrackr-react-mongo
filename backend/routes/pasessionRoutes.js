import express from 'express';
const router = express.Router({ mergeParams: true });
import {
  createPasession,
  getPasessionBySlug,
  getPasessionById,
  updatePasessionById,
  deletePasession,
} from '../controllers/pasessionController.js';
import checkObjectId from '../middleware/checkObjectId.js';
import { validatePasession } from '../middleware/validations.js';
import { registered } from '../middleware/loginMiddleware.js';
import {
  isPasessionAuthor,
  isPasessionByIdAuthor,
} from '../middleware/authorMiddleware.js';

router.route('/').post(registered, validatePasession, createPasession);
router
  .route('/:slugSession')
  .get(registered, isPasessionAuthor, getPasessionBySlug)
  .delete(registered, isPasessionAuthor, deletePasession);
router
  .route('/edit/:pasessionId')
  .get(
    registered,
    isPasessionByIdAuthor,
    checkObjectId('pasessiondId'),
    getPasessionById
  )
  .put(
    registered,
    isPasessionByIdAuthor,
    validatePasession,
    updatePasessionById
  );

export default router;
