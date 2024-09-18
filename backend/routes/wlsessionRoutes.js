import express from 'express';
const router = express.Router({ mergeParams: true });
import {
  createWlsession,
  getWlsessionBySlug,
} from '../controllers/wlsessionController.js';

router.route('/').post(createWlsession);
router.route('/:slugSession').get(getWlsessionBySlug);

export default router;
