import { Request, Response } from 'express';
import prisma from '../../prismaClient';

export const reservePlace = async (req: Request, res: Response) => {
    const { id } = req.params; // ID de la place
    const { id_client } = req.body; // ID du client

    try {
        const place = await prisma.place.findUnique({
            where: { id },
        });

        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }

        if (place.status !== 'LIBRE') {
            return res.status(400).json({ message: 'Place not available' });
        }

        const updatedPlace = await prisma.place.update({
            where: { id },
            data: {
                id_client,
                status: 'ATTENTE'
            }
        });

        res.json(updatedPlace);
    } catch (err) {
        res.status(500).json({ message: 'Error reserving place', error: (err as Error).message });
    }
};