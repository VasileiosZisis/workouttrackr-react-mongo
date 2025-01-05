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
import { isPasessionAuthor } from '../middleware/authorMiddleware.js';

router.route('/').post(registered, validatePasession, createPasession);
router
  .route('/:slugSession')
  .get(registered, isPasessionAuthor, getPasessionBySlug)
  .delete(registered, isPasessionAuthor, deletePasession);
router
  .route('/edit/:pasessionId')
  .get(checkObjectId, registered, isPasessionAuthor, getPasessionById)
  .put(registered, isPasessionAuthor, validatePasession, updatePasessionById);

export default router;
