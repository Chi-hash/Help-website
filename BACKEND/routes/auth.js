import express from 'express';
import { registerUser, loginUser, verifyEmail, resendVerificationEmail} from '../controllers/authController.js';
import { uploadProfilePic } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router = express.Router();


const upload = multer({ dest: 'uploadsprofile' });

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/upload-profile-pic', authMiddleware, upload.single('profilePic'), uploadProfilePic);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);




export default router;