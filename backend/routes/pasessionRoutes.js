import express from 'express';
const router = express.Router({ mergeParams: true });
import {
  createPasession,
  getPasessionBySlug,
  getPasessionById,
  updatePasessionById,
  deletePasession,
} from '../controllers/pasessionController.js';
import { registered } from '../middleware/loginMiddleware.js';

router.route('/').post(registered, createPasession);
router
  .route('/:slugSession')
  .get(registered, getPasessionBySlug)
  .delete(registered, deletePasession);
router
  .route('/edit/:pasessionId')
  .get(registered, getPasessionById)
  .put(registered, updatePasessionById);

export default router;
