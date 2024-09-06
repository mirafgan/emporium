"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_1 = require("../controllers/login");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
router.post('/register', login_1.register);
router.post('/login', login_1.login);
router.post('/cart/add', auth_middleware_1.default, login_1.addToCart);
router.delete('/cart/delete/:itemId', auth_middleware_1.default, login_1.deleteCart);
exports.default = router;
