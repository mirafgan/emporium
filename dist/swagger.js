// src/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
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
    apis: ['./dist/routes/*.js', './dist/controllers/*.js'], // Path to the API docs
};
// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);
export const setupSwagger = (app) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
export default swaggerSpec;
