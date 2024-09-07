"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const products_1 = require("../controllers/products");
const router = express_1.default.Router();
// Route handlers with type annotations
router.post('/create', auth_middleware_1.default, products_1.createProduct);
router.get('/all', products_1.getProducts);
router.get('/get/:id', products_1.getProductById);
router.put('/update/:id', auth_middleware_1.default, products_1.editProduct);
router.get('/search', products_1.searchProduct);
router.delete('/delete/:id', auth_middleware_1.default, products_1.deleteProductById);
// Routes for category and subcategory
router.get('/category/:category', products_1.getProductsByCategory);
router.get('/subcategory/:subcategory', products_1.getProductsBySubcategory);
exports.default = router;
