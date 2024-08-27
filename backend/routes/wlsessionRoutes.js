import express from 'express';
const router = express.Router({ mergeParams: true });
import { createWlsession } from '../controllers/wlsessionController.js';

router.route('/').post(createWlsession);

export default router;
