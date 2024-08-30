import express, { Request, Response } from 'express';
import productsRouter from "./routes/products.route"
import loginRouter from "./routes/login.route"
import categoriesRouter from "./routes/category.route"
import cors from 'cors'
import { setupSwagger } from './swagger'

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors())
app.use(express.json());

app.use('/', loginRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
  
setupSwagger(app);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});