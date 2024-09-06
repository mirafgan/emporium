"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = express_1.default.Router();
router.post('/upload', auth_middleware_1.default, upload_middleware_1.upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    res.status(200).json({
        message: 'File uploaded successfully.',
        file: req.file
    });
});
router.delete('/delete/:filename', auth_middleware_1.default, upload_middleware_1.deleteImage);
exports.default = router;
