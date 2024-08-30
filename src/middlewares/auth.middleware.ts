import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

interface DecodedToken {
    userid: number;
}

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized: Malformed token' });
            return;
        }

        const secret = process.env.JWT_SECRET as string; 

        const decoded = jwt.verify(token, secret) as DecodedToken;

        const user = await prisma.user.findUnique({
            where: { id: decoded.userid }
        });

        if (!user) {
            res.status(401).json({ error: 'Unauthorized: Invalid user' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

export default auth;
