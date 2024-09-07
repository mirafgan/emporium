"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.deleteImage = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS environment variables are not set.");
}
const s3 = new client_s3_1.S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
});
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = req.params;
    if (!filename || typeof filename !== 'string') {
        return res.status(400).json({ error: "Filename must be provided as a string." });
    }
    try {
        const deleteParams = {
            Bucket: "telefonclubb",
            Key: filename
        };
        yield s3.send(new client_s3_1.DeleteObjectCommand(deleteParams));
        console.log(`Successfully deleted image: ${filename}`);
        res.status(200).json({ message: `Successfully deleted image: ${filename}` });
    }
    catch (error) {
        // Type assertion to handle error as an instance of Error
        if (error instanceof Error) {
            console.error("Error deleting image:", error.message);
            res.status(500).json({ error: `Failed to delete image: ${error.message}` });
        }
        else {
            console.error("Unknown error deleting image:", error);
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
});
exports.deleteImage = deleteImage;
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: 'telefonclubb',
        key: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    })
});
exports.upload = upload;
