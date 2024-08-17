import { Request, Response } from 'express';
import prisma from '../../prismaClient';

// Création d'une nouvelle réservation
export const createReservation = async (req: Request, res: Response) => {
    try {
        const { date_reservation, id_cooperative } = req.body;

        const newReservation = await prisma.reservation.create({
            data: {
                date_reservation,
                cooperative: {
                    connect: { id: id_cooperative },
                },
            },
        });

        res.status(201).json(newReservation);
    } catch (err : any) {
        res.status(400).json({ message: 'Error creating reservation', error: err.message });
    }
};

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
