import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import { createProduct, deleteProductById, editProduct, getProductById, getProducts, getProductsByCategory, getProductsBySubcategory, searchProduct } from '../controllers/products.js';
const router = express.Router();
// Route handlers with type annotations
router.post('/create', auth, createProduct);
router.get('/all', getProducts);
router.get('/get/:id', getProductById);
router.put('/update/:id', auth, editProduct);
router.get('/search', searchProduct);
router.delete('/delete/:id', auth, deleteProductById);
// Routes for category and subcategory
router.get('/category/:category', getProductsByCategory);
router.get('/subcategory/:subcategory', getProductsBySubcategory);
export default router;
