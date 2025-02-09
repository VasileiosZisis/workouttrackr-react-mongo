import express from 'express';
const router = express.Router();
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { registered, admin } from '../middleware/loginMiddleware.js';
import {
  validateRegisterUser,
  validateUpdateUser,
} from '../middleware/validations.js';

router.route('/').post(registerUser, validateRegisterUser);
router.post('/logout', logoutUser);
router.post('/login', loginUser);
router
  .route('/profile')
  .get(registered, getUserProfile)
  .put(registered, validateUpdateUser, updateUserProfile);

export default router;
