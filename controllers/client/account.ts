import { Request, Response } from 'express';
import prisma from '../../prismaClient';


export const updateClientAccount = async (req: Request, res: Response) => {
    const { id } = req.body;
    const { name, lastname, image, cin, close_num, num_tel, adress } = req.body;

    try {
        // Vérifier si le client existe
        const client = await prisma.client.findUnique({
            where: { id: id },
        });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Mettre à jour le client
        const updatedClient = await prisma.client.update({
            where: { id: id },
            data: {
                name,
                lastname,
                image,
                cin,
                close_num,
            },
        });

        const updatedUser = await prisma.utilisateur.update({
            where: { id_client: id },
            data: {
                num_tel,
                adress,
            },
        });

        res.json({ client: updatedClient, user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: 'Error updating client account', error: (err as Error).message });
    }
};
