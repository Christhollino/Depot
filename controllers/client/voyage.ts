import { Request, Response } from 'express';
import prisma from '../../prismaClient';
import { parseISO } from 'date-fns';

// Récupérer les listes des voyages triés par date
export const getVoyages = async (req: Request, res: Response) => {
    try {
        const voyages = await prisma.voyage.findMany({
            where: {
                start: {
                    gte: new Date()
                }
            },
            orderBy: {
                start: 'asc'
            },
            include: {
                reservation: {
                    include: {
                        cooperative: true
                    }
                }
            }
        });
        res.json(voyages);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving voyages', error: (err as Error).message });
    }
};

// Rechercher les voyages par date de départ
export const searchVoyagesByDate = async (req: Request, res: Response) => {
    const { date } = req.query;

    try {
        const parsedDate = parseISO(date as string);
        const voyages = await prisma.voyage.findMany({
            where: {
                start: {
                    gte: parsedDate,
                    lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000) // Cherche le jour entier
                }
            },
            include: {
                reservation: {
                    include: {
                        cooperative: true
                    }
                }
            }
        });
        res.json(voyages);
    } catch (err) {
        res.status(500).json({ message: 'Error searching voyages by date', error: (err as Error).message });
    }
};

// Rechercher les voyages par cooperative
export const searchVoyagesByCooperative = async (req: Request, res: Response) => {
    const { cooperativeId } = req.query;

    try {
        const voyages = await prisma.voyage.findMany({
            where: {
                reservation: {
                    id_cooperative: cooperativeId as string
                }
            },
            include: {
                reservation: {
                    include: {
                        cooperative: true
                    }
                }
            }
        });
        res.json(voyages);
    } catch (err) {
        res.status(500).json({ message: 'Error searching voyages by cooperative', error: (err as Error).message });
    }
};


