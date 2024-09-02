import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';
import { authenticateJWT } from '../middlewares/authMiddleware';


// Inscription d'un utilisateur
export const signUp = async (req: Request, res: Response) => {
    const { mail, password, role, name, lastname, cin, num_tel, close_num, id_cooperative } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.utilisateur.create({
            data: {
                mail,
                password: hashedPassword,
                role,
                num_tel,
                client: role === 'CLIENT' ? {
                    create: {
                        name,
                        lastname,
                        cin,
                        close_num,
                    }
                } : undefined,
                cooperative: role === 'COOPERATIVE' ? (
                    id_cooperative ? {
                        connect: { id: id_cooperative }
                    } : {
                        create: {
                            name,
                        }
                    }
                ) : undefined
            },
        });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.status(201).json({ message: 'User created', token });
    } catch (err: any) {
        console.error('Error creating user:', err);
        res.status(400).json({ message: 'Error creating user', error: err.message });
    }
};

// Connexion d'un utilisateur
export const login = async (req: Request, res: Response) => {
    const { mail, password } = req.body;

    const user = await prisma.utilisateur.findUnique({
        where: { mail },
    });
    console.log(user)

    if (user && bcrypt.compareSync(password, user.password)) {
        console.log(process.env.JWT_SECRET as string);
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

export const getUserInfo = (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id, role } = req.user;
    res.status(200).json({ id, role });
};

export const logout = (req: Request, res: Response) => {
    res.json({ message: 'User logged out' });
};
