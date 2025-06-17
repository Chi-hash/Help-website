import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { uploadProfilePic } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Configure multer
const upload = multer({ dest: 'uploadsprofile' }); // Temporary storage

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/upload-profile-pic', authMiddleware, upload.single('profilePic'), uploadProfilePic);

export default router;