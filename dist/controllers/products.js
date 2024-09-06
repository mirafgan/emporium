var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProduct = yield prisma.product.create({
            data: req.body
        });
        res.status(201).json(newProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});
export const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, sortBy = 'createdTime', sortOrder = 'desc', categoryId, SubcategoryId, brandId, colorId, sizeId, minPrice, maxPrice, discount } = req.query;
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        const orderBy = {
            [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc'
        };
        const where = {};
        if (categoryId) {
            where.categoryId = parseInt(categoryId);
        }
        if (SubcategoryId) {
            where.SubcategoryId = parseInt(SubcategoryId);
        }
        if (brandId) {
            where.brandsId = parseInt(brandId);
        }
        if (colorId) {
            where.colorsId = parseInt(colorId);
        }
        if (sizeId) {
            where.sizeId = parseInt(sizeId);
        }
        if (minPrice && maxPrice) {
            where.price = {
                gte: parseFloat(minPrice),
                lte: parseFloat(maxPrice)
            };
        }
        else if (minPrice) {
            where.price = {
                gte: parseFloat(minPrice)
            };
        }
        else if (maxPrice) {
            where.price = {
                lte: parseFloat(maxPrice)
            };
        }
        if (discount === 'true') {
            where.discount = {
                gt: 0
            };
        }
        else if (discount === 'false') {
            where.discount = 0;
        }
        const products = yield prisma.product.findMany({
            where,
            orderBy,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            include: {
                category: true,
                Subcategory: true,
                Brands: true,
                Colors: true,
                Size: true,
            }
        });
        const totalProducts = yield prisma.product.count({ where });
        res.status(200).json({
            data: products,
            meta: {
                totalProducts,
                totalPages: Math.ceil(totalProducts / pageSize),
                currentPage: pageNumber,
                pageSize
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
export const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma.product.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                Brands: true,
                Colors: true,
                Size: true,
                category: true,
                Subcategory: true,
            }
        });
        if (product) {
            res.status(200).json(product);
        }
        else {
            res.status(404).json({ error: 'Product not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});
export const editProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedProduct = yield prisma.product.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(404).json({ error: 'Product not found' });
        }
        else {
            res.status(500).json({ error: 'Failed to update product' });
        }
    }
});
export const deleteProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.product.delete({
            where: { id: Number(req.params.id) }
        });
        res.status(204).send("Product deleted");
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(404).json({ error: 'Product not found' });
        }
        else {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    }
});
export const searchProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query.q;
        const products = yield prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } },
                    { category: { name: { contains: query } } },
                    { Subcategory: { name: { contains: query } } },
                ],
            },
        });
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search products' });
    }
});
export const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = Number(req.params.category);
        if (isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
        const products = yield prisma.product.findMany({
            where: {
                categoryId: categoryId
            },
            include: {
                category: true,
                Subcategory: true,
                Brands: true,
                Colors: true,
                Size: true,
            }
        });
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to fetch products by category' });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});
export const getProductsBySubcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany({
            where: { subcategoryId: Number(req.params.subcategory) }
        });
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products by Subcategory' });
    }
});
