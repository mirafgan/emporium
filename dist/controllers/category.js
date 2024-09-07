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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubcategory = exports.updateSubcategory = exports.deleteSubcategoryById = exports.editSubcategoriesById = exports.getSubcategoriesById = exports.getSubcategories = exports.createSubcategory = exports.deleteCategoryById = exports.editCategoriesById = exports.getCategoriesById = exports.getCategories = exports.createCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Operations related to categories
 *   - name: Subcategories
 *     description: Operations related to subcategories
 */
/**
 * @swagger
 * /categories/create:
 *   post:
 *     summary: Create a new category
 *     description: Create a new category in the system.
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category.
 *               slug:
 *                 type: string
 *                 description: Slug for the category.
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Name is required' });
            return;
        }
        const newCategory = yield prisma.category.create({
            data: { name, slug },
        });
        res.status(201).json(newCategory);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});
exports.createCategory = createCategory;
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     description: Fetches a list of all categories.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   slug:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.category.findMany();
        res.status(200).json(categories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});
exports.getCategories = getCategories;
/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     description: Fetches a single category by its ID.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to retrieve
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
const getCategoriesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.id);
        const category = yield prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (category) {
            res.status(200).json(category);
        }
        else {
            res.status(404).json({ error: 'Category not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});
exports.getCategoriesById = getCategoriesById;
/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     description: Updates an existing category by its ID.
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the category.
 *               slug:
 *                 type: string
 *                 description: New slug for the category.
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
const editCategoriesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.id);
        const { name, slug } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Name is required' });
            return;
        }
        const updatedCategory = yield prisma.category.update({
            where: { id: categoryId },
            data: { name, slug },
        });
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(404).json({ error: 'Category not found' });
        }
        else {
            res.status(500).json({ error: 'Failed to update category' });
        }
    }
});
exports.editCategoriesById = editCategoriesById;
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     description: Deletes a category by its ID.
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to delete
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
const deleteCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.id);
        yield prisma.category.delete({
            where: { id: categoryId },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(404).json({ error: 'Category not found' });
        }
        else {
            res.status(500).json({ error: 'Failed to delete category' });
        }
    }
});
exports.deleteCategoryById = deleteCategoryById;
/**
 * @swagger
 * /subcategories/create:
 *   post:
 *     summary: Create a new subcategory
 *     description: Creates a new subcategory in the system.
 *     tags:
 *       - Subcategories
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the subcategory.
 *               categoryId:
 *                 type: integer
 *                 description: ID of the parent category.
 *               slug:
 *                 type: string
 *                 description: Slug for the subcategory.
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 categoryId:
 *                   type: integer
 *                 slug:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
const createSubcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, categoryId, slug } = req.body;
        if (!name || !categoryId) {
            res.status(400).json({ error: 'Name and Category ID are required' });
            return;
        }
        const newSubcategory = yield prisma.subcategory.create({
            data: { name, categoryId, slug },
        });
        res.status(201).json(newSubcategory);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create subcategory' });
    }
});
exports.createSubcategory = createSubcategory;
/**
 * @swagger
 * /subcategories:
 *   get:
 *     summary: Get all subcategories
 *     description: Fetches a list of all subcategories.
 *     tags:
 *       - Subcategories
 *     responses:
 *       200:
 *         description: List of subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   categoryId:
 *                     type: integer
 *                   slug:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
const getSubcategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategories = yield prisma.subcategory.findMany();
        res.status(200).json(subcategories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch subcategories' });
    }
});
exports.getSubcategories = getSubcategories;
/**
 * @swagger
 * /subcategories/{id}:
 *   get:
 *     summary: Get a subcategory by ID
 *     description: Fetches a single subcategory by its ID.
 *     tags:
 *       - Subcategories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the subcategory to retrieve
 *     responses:
 *       200:
 *         description: Subcategory found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 categoryId:
 *                   type: integer
 *                 slug:
 *                   type: string
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Internal server error
 */
const getSubcategoriesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategoryId = parseInt(req.params.id);
        const subcategory = yield prisma.subcategory.findUnique({
            where: { id: subcategoryId },
        });
        if (subcategory) {
            res.status(200).json(subcategory);
        }
        else {
            res.status(404).json({ error: 'Subcategory not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch subcategory' });
    }
});
exports.getSubcategoriesById = getSubcategoriesById;
/**
 * @swagger
 * /subcategories/{id}:
 *   put:
 *     summary: Update a subcategory by ID
 *     description: Updates an existing subcategory by its ID.
 *     tags:
 *       - Subcategories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the subcategory to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the subcategory.
 *               categoryId:
 *                 type: integer
 *                 description: New ID of the parent category.
 *               slug:
 *                 type: string
 *                 description: New slug for the subcategory.
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 categoryId:
 *                   type: integer
 *                 slug:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Internal server error
 */
const editSubcategoriesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategoryId = parseInt(req.params.id);
        const { name, categoryId, slug } = req.body;
        if (!name || !categoryId) {
            res.status(400).json({ error: 'Name and Category ID are required' });
            return;
        }
        const updatedSubcategory = yield prisma.subcategory.update({
            where: { id: subcategoryId },
            data: { name, categoryId, slug },
        });
        res.status(200).json(updatedSubcategory);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(404).json({ error: 'Subcategory not found' });
        }
        else {
            res.status(500).json({ error: 'Failed to update subcategory' });
        }
    }
});
exports.editSubcategoriesById = editSubcategoriesById;
/**
 * @swagger
 * /subcategories/{id}:
 *   delete:
 *     summary: Delete a subcategory by ID
 *     description: Deletes a subcategory by its ID.
 *     tags:
 *       - Subcategories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the subcategory to delete
 *     responses:
 *       204:
 *         description: Subcategory deleted successfully
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Internal server error
 */
const deleteSubcategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategoryId = parseInt(req.params.id);
        yield prisma.subcategory.delete({
            where: { id: subcategoryId },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(404).json({ error: 'Subcategory not found' });
        }
        else {
            res.status(500).json({ error: 'Failed to delete subcategory' });
        }
    }
});
exports.deleteSubcategoryById = deleteSubcategoryById;
/**
 * @swagger
 * /subcategories/update/{id}:
 *   put:
 *     summary: Update a subcategory by ID
 *     description: Updates the details of a specific subcategory identified by its ID.
 *     tags:
 *       - Subcategories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the subcategory to be updated.
 *     requestBody:
 *       description: Subcategory data to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the subcategory.
 *               categoryId:
 *                 type: integer
 *                 description: ID of the category to which the subcategory belongs.
 *               slug:
 *                 type: string
 *                 description: New slug for the subcategory.
 *             required:
 *               - name
 *               - categoryId
 *     responses:
 *       200:
 *         description: Subcategory updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the updated subcategory.
 *                 name:
 *                   type: string
 *                   description: Updated name of the subcategory.
 *                 categoryId:
 *                   type: integer
 *                   description: ID of the category to which the subcategory belongs.
 *                 slug:
 *                   type: string
 *                   description: Updated slug for the subcategory.
 *       400:
 *         description: Bad request due to missing required fields.
 *       404:
 *         description: Subcategory not found.
 *       500:
 *         description: Internal server error.
 */
const updateSubcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategoryId = parseInt(req.params.id);
        const { name, categoryId, slug } = req.body;
        if (!name || !categoryId) {
            res.status(400).json({ error: 'Name and Category ID are required' });
            return;
        }
        const updatedSubcategory = yield prisma.subcategory.update({
            where: { id: subcategoryId },
            data: {
                name,
                categoryId: parseInt(categoryId),
                slug
            },
        });
        res.status(200).json(updatedSubcategory);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(404).json({ error: 'Subcategory not found' });
        }
        else {
            res.status(500).json({ error: 'Failed to update subcategory' });
        }
    }
});
exports.updateSubcategory = updateSubcategory;
/**
 * @swagger
 * /subcategories/delete/{id}:
 *   delete:
 *     summary: Delete a subcategory by ID
 *     description: Deletes a specific subcategory identified by its ID.
 *     tags:
 *       - Subcategories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the subcategory to be deleted.
 *     responses:
 *       204:
 *         description: Subcategory deleted successfully.
 *       404:
 *         description: Subcategory not found.
 *       500:
 *         description: Internal server error.
 */
const deleteSubcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategoryId = parseInt(req.params.id);
        const result = yield prisma.subcategory.delete({
            where: { id: subcategoryId },
        });
        res.status(204).send(result);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(404).json({ error: 'Subcategory not found' });
        }
        else {
            res.status(500).json({ error: 'Failed to delete subcategory' });
        }
    }
});
exports.deleteSubcategory = deleteSubcategory;
