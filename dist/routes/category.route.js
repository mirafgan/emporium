"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const category_1 = require("../controllers/category");
const router = express_1.default.Router();
router.post('/create', auth_middleware_1.default, category_1.createCategory);
router.get('/all', category_1.getCategories);
router.get('/get/:id', category_1.getCategoriesById);
router.put('/update/:id', auth_middleware_1.default, category_1.editCategoriesById);
router.delete('/delete/:id', auth_middleware_1.default, category_1.deleteCategoryById);
router.post('/subcategory/create', auth_middleware_1.default, category_1.createSubcategory);
router.put('/subcategory/update/:id', auth_middleware_1.default, category_1.updateSubcategory);
router.delete('/subcategory/delete/:id', auth_middleware_1.default, category_1.deleteSubcategory);
exports.default = router;
