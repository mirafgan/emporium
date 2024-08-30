import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProduct = async (req: Request, res: Response) => {
    try {
        const newProduct = await prisma.product.create({
            data: req.body
        });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdTime',
            sortOrder = 'desc',
            categoryId,
            SubcategoryId,
            brandId,
            colorId,
            sizeId,
            minPrice,
            maxPrice,
            discount
        } = req.query;



        const pageNumber = parseInt(page as string);
        const pageSize = parseInt(limit as string);


        const orderBy = {
            [sortBy as string]: sortOrder === 'asc' ? 'asc' : 'desc'
        };

        const where: any = {};

        if (categoryId) {
            where.categoryId = parseInt(categoryId as string);
        }
        if (SubcategoryId) {
            where.SubcategoryId = parseInt(SubcategoryId as string);
        }
        if (brandId) {
            where.brandsId = parseInt(brandId as string);
        }
        if (colorId) {
            where.colorsId = parseInt(colorId as string);
        }
        if (sizeId) {
            where.sizeId = parseInt(sizeId as string);
        }
        if (minPrice && maxPrice) {
            where.price = {
                gte: parseFloat(minPrice as string),
                lte: parseFloat(maxPrice as string)
            };
        } else if (minPrice) {
            where.price = {
                gte: parseFloat(minPrice as string)
            };
        } else if (maxPrice) {
            where.price = {
                lte: parseFloat(maxPrice as string)
            };
        }
        if (discount === 'true') {
            where.discount = {
                gt: 0
            };
        } else if (discount === 'false') {
            where.discount = 0;
        }

        const products = await prisma.product.findMany({
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

        const totalProducts = await prisma.product.count({ where });

        res.status(200).json({
            data: products,
            meta: {
                totalProducts,
                totalPages: Math.ceil(totalProducts / pageSize),
                currentPage: pageNumber,
                pageSize
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await prisma.product.findUnique({
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
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const editProduct = async (req: Request, res: Response) => {
    try {
        const updatedProduct = await prisma.product.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.status(500).json({ error: 'Failed to update product' });
        }
    }
};

export const deleteProductById = async (req: Request, res: Response) => {
    try {
        await prisma.product.delete({
            where: { id: Number(req.params.id) }
        });
        res.status(204).send("Product deleted");
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    }
};

export const searchProduct = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        const products = await prisma.product.findMany({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search products' });
    }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = Number(req.params.category);

        if (isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        const products = await prisma.product.findMany({
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
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to fetch products by category' });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};

export const getProductsBySubcategory = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            where: { subcategoryId: Number(req.params.subcategory) }
        });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products by Subcategory' });
    }
};



