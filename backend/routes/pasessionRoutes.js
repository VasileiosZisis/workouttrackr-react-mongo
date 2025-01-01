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

router.route('/').post(registered, validatePasession, createPasession);
router
  .route('/:slugSession')
  .get(registered, getPasessionBySlug)
  .delete(registered, deletePasession);
router
  .route('/edit/:pasessionId')
  .get(registered, checkObjectId, getPasessionById)
  .put(registered, validatePasession, updatePasessionById);

export default router;
