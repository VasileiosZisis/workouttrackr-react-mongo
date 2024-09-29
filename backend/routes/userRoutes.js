import express from 'express';
const router = express.Router();
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from '../controllers/userController.js';
import { registered, admin } from '../middleware/loginMiddleware.js';

router.route('/').post(registerUser).get(registered, admin, getAllUsers);
router.post('/logout', logoutUser);
router.post('/login', loginUser);
router
  .route('/profile')
  .get(registered, getUserProfile)
  .put(registered, updateUserProfile);

export default router;
