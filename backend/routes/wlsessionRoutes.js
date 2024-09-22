import express from 'express';
const router = express.Router({ mergeParams: true });
import {
  createWlsession,
  getWlsessionBySlug,
  getWlsessionById,
  updateWlsessionById,
} from '../controllers/wlsessionController.js';

router.route('/').post(createWlsession);
router.route('/:slugSession').get(getWlsessionBySlug);
router
  .route('/edit/:wlsessionId')
  .get(getWlsessionById)
  .put(updateWlsessionById);

export default router;
