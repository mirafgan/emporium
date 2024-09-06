import express from 'express';
import productsRouter from "./routes/products.route.js";
import loginRouter from "./routes/login.route.js";
import categoriesRouter from "./routes/category.route.js";
import cors from 'cors';
import { setupSwagger } from './swagger.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use('/', loginRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
setupSwagger(app);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
