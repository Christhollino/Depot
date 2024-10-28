import { Request, Response } from 'express';
import prisma from '../../prismaClient';

// Création d'une nouvelle réservation
export const createReservation = async (req: Request, res: Response) => {
    try {
        const { date_reservation } = req.body;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { id: req.user.id },
            include: { cooperative: true },
        });
        if (!utilisateur || !utilisateur.cooperative) {
            return res.status(403).json({ message: 'User not associated with any cooperative' });
        }
        const cooperativeId = utilisateur.cooperative.id;
        const parsedDate = new Date(date_reservation);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }
        const isoDate = parsedDate.toISOString();
        console.log(cooperativeId)

        const newReservation = await prisma.reservation.create({
            data: {
                date_reservation: isoDate,
                cooperative: {
                    connect: { id: cooperativeId },
                },
            },
        });

        res.status(201).json(newReservation);
    } catch (err: any) {
        res.status(400).json({ message: 'Error creating reservation', error: err.message });
        console.log(err.message);
    }
};

export const getAllReservation = async (req : Request, res :Response)=>{
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const chauffeurs = await prisma.reservation.findMany({
            where: { id_cooperative: req.user.id_cooperative },
            include: {
                cooperative: true,
            },
        });
        res.json(chauffeurs);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving reservations', error: (err as Error).message });
    }
}

// Modification d'une réservation existante
export const updateReservation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { date_reservation, id_cooperative } = req.body;

        const updatedReservation = await prisma.reservation.update({
            where: { id },
            data: {
                date_reservation,
                cooperative: {
                    connect: { id: id_cooperative },
                },
            },
        });

        res.status(200).json(updatedReservation);
    } catch (err : any) {
        res.status(400).json({ message: 'Error updating reservation', error: err.message });
    }
};
