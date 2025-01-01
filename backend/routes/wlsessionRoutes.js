import express from 'express';
const router = express.Router({ mergeParams: true });
import {
  createWlsession,
  getWlsessionBySlug,
  getWlsessionById,
  updateWlsessionById,
  deleteWlsession,
} from '../controllers/wlsessionController.js';
import checkObjectId from '../middleware/checkObjectId.js';
import { validateWlsession } from '../middleware/validations.js';
import { registered } from '../middleware/loginMiddleware.js';

router.route('/').post(registered, validateWlsession, createWlsession);
router
  .route('/:slugSession')
  .get(registered, getWlsessionBySlug)
  .delete(registered, deleteWlsession);
router
  .route('/edit/:wlsessionId')
  .get(registered, checkObjectId, getWlsessionById)
  .put(registered, validateWlsession, updateWlsessionById);

export default router;
