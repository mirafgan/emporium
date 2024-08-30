import express, { Request, Response } from 'express';
import { Router } from 'express';
import auth from '../middlewares/auth.middleware';
import { deleteImage, upload } from '../middlewares/upload.middleware'

const router: Router = express.Router();

router.post('/upload', auth, upload.single('image'), (req: Request, res: Response) => {
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
