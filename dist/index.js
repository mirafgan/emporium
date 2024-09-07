"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_route_1 = __importDefault(require("./routes/products.route"));
const login_route_1 = __importDefault(require("./routes/login.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const cors_1 = __importDefault(require("cors"));
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/', login_route_1.default);
app.use('/products', products_route_1.default);
app.use('/categories', category_route_1.default);
(0, swagger_1.setupSwagger)(app);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
