import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import { deleteImage, upload } from '../middlewares/upload.middleware.js';
const router = express.Router();
router.post('/upload', auth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    res.status(200).json({
        message: 'File uploaded successfully.',
        file: req.file
    });
});
router.delete('/delete/:filename', auth, deleteImage);
export default router;
