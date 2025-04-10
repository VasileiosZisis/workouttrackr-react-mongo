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
import {
  isWlsessionAuthor,
  isWlsessionByIdAuthor,
} from '../middleware/authorMiddleware.js';

router.route('/').post(registered, validateWlsession, createWlsession);
router
  .route('/:slugSession')
  .get(registered, isWlsessionAuthor, getWlsessionBySlug)
  .delete(registered, isWlsessionAuthor, deleteWlsession);
router
  .route('/edit/:wlsessionId')
  .get(
    registered,
    isWlsessionByIdAuthor,
    checkObjectId('wlsessionId'),
    getWlsessionById
  )
  .put(
    registered,
    isWlsessionByIdAuthor,
    validateWlsession,
    updateWlsessionById
  );

export default router;
