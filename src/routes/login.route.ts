import express from 'express';
import { register, login, addToCart, deleteCart } from '../controllers/login';
import auth from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/cart/add', auth, addToCart);
router.delete('/cart/delete/:itemId', auth, deleteCart);

export default router;
