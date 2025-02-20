import express from 'express';
const router = express.Router();
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js';
import { registered } from '../middleware/loginMiddleware.js';
import {
  validateRegisterUser,
  validateUpdateUser,
  validateForgotPassword,
  validateResetPassword,
} from '../middleware/validations.js';

router.route('/').post(registerUser, validateRegisterUser);
router.post('/logout', logoutUser);
router.post('/login', loginUser);
router
  .route('/profile')
  .get(registered, getUserProfile)
  .put(registered, validateUpdateUser, updateUserProfile);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPassword);

export default router;
