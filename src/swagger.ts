// src/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import fs from "node:fs"
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
  apis: ['src/routes/*.ts', 'src/controllers/*.ts'], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);
fs.writeFileSync("swagger.json", JSON.stringify(swaggerSpec))
export const setupSwagger = (app: Express) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSpec;
