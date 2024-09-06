import express from 'express';
import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import { createCategory, createSubcategory, deleteCategoryById, deleteSubcategory, editCategoriesById, getCategories, getCategoriesById, updateSubcategory } from "../controllers/category.js"
const router: Router = express.Router();

router.post('/create', auth, createCategory);
router.get('/all', getCategories);
router.get('/get/:id', getCategoriesById);
router.put('/update/:id', auth, editCategoriesById);
router.delete('/delete/:id', auth, deleteCategoryById);

router.post('/subcategory/create', auth, createSubcategory);
router.put('/subcategory/update/:id', auth, updateSubcategory);
router.delete('/subcategory/delete/:id', auth, deleteSubcategory);


export default router;
