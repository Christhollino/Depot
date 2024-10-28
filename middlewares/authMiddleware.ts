import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../prismaClient';


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string; role: string };
    }
  }
}

interface DecodedToken extends JwtPayload {
    id: string;
    role: string;
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log(token)
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        console.log('Decoded Token:', decoded);
        req.user = decoded;

        const user = await prisma.utilisateur.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            console.log('User not found for ID:', decoded.id);
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.log('Authenticated User:', user);
        next();
    } catch (err) {
        console.log(err)
        console.error('Token verification error:', err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
