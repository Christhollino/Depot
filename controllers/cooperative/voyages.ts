import { Request, Response } from 'express';
import prisma from '../../prismaClient';
import { Status } from '@prisma/client';

// Création d'un nouveau voyage avec génération des places
export const createVoyage = async (req: Request, res: Response) => {
    try {
        const { start, arrived, id_reservation, num_places, coasts } = req.body;

        const newVoyage = await prisma.voyage.create({
            data: {
                start,
                arrived,
                reservation: {
                    connect: { id: id_reservation },
                },
            },
        });

        // Génération des places pour le voyage créé
        const placesData = Array.from({ length: num_places }, (_, index) => ({
            num_place: index + 1,
            status: Status.LIBRE,
            coasts,
            id_voyage: newVoyage.id,
        }));

        await prisma.place.createMany({ data: placesData });

        res.status(201).json(newVoyage);
    } catch (err : any) {
        res.status(400).json({ message: 'Error creating voyage', error: err.message });
    }
};

// Lecture des voyages
export const getVoyages = async (req: Request, res: Response) => {
    try {
        const { dateDepart } = req.query;
        const date = dateDepart ? new Date(dateDepart as string) : new Date();

        const voyages = await prisma.voyage.findMany({
            where: {
                start: {
                    gte: date,
                },
            },
            include: {
                reservation: {
                    include: {
                        cooperative: true,
                    },
                },
                voiture: true,
                places: true,
            },
        });

        res.status(200).json(voyages);
    } catch (err: any) {
        res.status(400).json({ message: 'Error fetching voyages', error: err.message });
    }
};


// Suppression d'un voyage
export const deleteVoyage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.place.deleteMany({ where: { id_voyage: id } });
        await prisma.voyage.delete({ where: { id } });

        res.status(200).json({ message: 'Voyage deleted successfully' });
    } catch (err : any) {
        res.status(400).json({ message: 'Error deleting voyage', error: err.message });
    }
};
