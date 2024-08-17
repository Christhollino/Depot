import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../prismaClient';

interface DecodedToken extends JwtPayload {
    id: string;
    role: string;
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        req.user = decoded;

        const user = await prisma.utilisateur.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
