import express from 'express';
import productsRouter from "./routes/products.route.js";
import loginRouter from "./routes/login.route.js";
import categoriesRouter from "./routes/category.route.js";
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const app = express();
const PORT = process.env.PORT || 3000;
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
    apis: ['./routes/*.ts', './controllers/*.ts'], // Path to the API docs
};
app.use(cors());
app.use(express.json());
const swaggerSpec = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', loginRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
// setupSwagger(app);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
