import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

interface LoginRequestBody {
    username: string;
    password: string;
}

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Operations related to user management
 */

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login a user
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }

        const user: User | null = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }

        const token = jwt.sign({ userid: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

interface RegisterRequestBody extends LoginRequestBody {
    name: string;
    phone: string;
    address: string;
    dob: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | 'GAY' | 'TRANS';
    email: string;
}

interface AddToCartRequestBody {
    productId: number;
}

/**
 * @swagger
 * /add-to-cart:
 *   post:
 *     tags:
 *       - User
 *     summary: Add product to cart
 *     description: Adds a product to the authenticated user's cart. Requires a valid JWT token.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product added to cart
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
export const addToCart = async (req: Request<{}, {}, AddToCartRequestBody>, res: Response): Promise<void> => {
    try {
        const { productId } = req.body;

        if (!productId) {
            res.status(400).json({ error: 'Product ID is required' });
            return;
        }

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

        const user = await prisma.user.findUnique({ where: { id: decoded.userid } });

        if (!user) {
            res.status(401).json({ error: 'Unauthorized: Invalid user' });
            return;
        }

        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { cart: { connect: { id: productId } } },
        });

        res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
};

interface DeleteCartRequestBody {
    itemId: number;
}

/**
 * @swagger
 * /delete-cart:
 *   post:
 *     tags:
 *       - User
 *     summary: Remove item from cart
 *     description: Removes an item from the authenticated user's cart. Requires a valid JWT token.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
export const deleteCart = async (req: Request<{}, {}, DeleteCartRequestBody>, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }
        const userId = Number(req.user.id);
        const { itemId } = req.body;

        if (!itemId) {
            res.status(400).json({ error: 'Item ID is required' });
            return;
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                cart: {
                    disconnect: { id: itemId },
                },
            },
        });

        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER, GAY, TRANS]
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
    try {
        const { name, username, phone, address, dob, gender, email, password } = req.body;

        if (!name || !username || !phone || !address || !dob || !gender || !email || !password) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ username }, { email }] },
        });

        if (existingUser) {
            res.status(400).json({ error: 'Username or email already taken' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                phone,
                address,
                dob: new Date(dob),
                gender,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};