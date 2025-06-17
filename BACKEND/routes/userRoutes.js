import express from 'express';
import multer from 'multer';
import { uploadProfilePic, getAllUsers } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();


const upload = multer({ dest: 'uploads/' });


router.post('/upload-profile-pic', authMiddleware, upload.single('profilePic'), uploadProfilePic);


router.get('/', authMiddleware, getAllUsers);

export default router;
