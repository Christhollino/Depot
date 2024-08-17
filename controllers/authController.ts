import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';


// Inscription d'un utilisateur
export const signUp = async (req: Request, res: Response) => {
    const { mail, password, role, name, lastname, cin,num_tel, close_num, id_cooperative } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed password", hashedPassword)

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
                cooperative: role === 'COOPERATIVE' ? {
                    connect: { id: id_cooperative }
                } : undefined
            },
        });

        res.status(201).json({ message: 'User created', user });
    } catch (err : any) {
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

// Déconnexion d'un utilisateur
export const logout = (req: Request, res: Response) => {
    // Pour JWT, il n'y a pas de déconnexion server-side. La déconnexion est généralement gérée sur le client en supprimant le token.
    res.json({ message: 'User logged out' });
};
