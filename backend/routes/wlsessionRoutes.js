import express from 'express';
const router = express.Router({ mergeParams: true });
import {
  createWlsession,
  getWlsessionBySlug,
  getWlsessionById,
  updateWlsessionById,
  deleteWlsession,
} from '../controllers/wlsessionController.js';
import { registered } from '../middleware/loginMiddleware.js';

router.route('/').post(registered, createWlsession);
router
  .route('/:slugSession')
  .get(registered, getWlsessionBySlug)
  .delete(registered, deleteWlsession);
router
  .route('/edit/:wlsessionId')
  .get(registered, getWlsessionById)
  .put(registered, updateWlsessionById);

export default router;
