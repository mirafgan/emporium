"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
// src/swagger.ts
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger = __importDefault(require("./swagger.json"));

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'eCommerce',
        version: '1.0.0',
        description: 'API docs',
    },
    servers: [
        {
            url: `https://${process.env.VERCEL_URL}`,
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
};
// Options for the swagger docs
const options = {
    swaggerDefinition,
    apis: ['./routes/*.js', './controllers/*.js'], // Path to the API docs
};
// Initialize swagger-jsdoc
// const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
// const swaggerSpec = ;
const setupSwagger = (app) => {
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger));
};
exports.setupSwagger = setupSwagger;
