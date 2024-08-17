import { Request, Response } from 'express';
import prisma from '../../prismaClient';

// Créer une nouvelle voiture
export const createVoiture = async (req: Request, res: Response) => {
    const { matricule, id_chauffeur, id_chauffeur2, status } = req.body;

    try {
        // Vérifier si les chauffeurs ne sont pas déjà assignés à une autre voiture
        const chauffeur1 = await prisma.chauffeur.findUnique({
            where: { id: req.params.id },
            include: {
                voitures: true,
            },
        });

        const chauffeur2 = id_chauffeur2 ? await prisma.chauffeur.findUnique({
            where: { id: id_chauffeur2 },
            include: { voitures: true },
        }) : null;

        if (chauffeur1?.voitures || (chauffeur2 && chauffeur2.voitures)) {
            return res.status(400).json({ message: 'One or both chauffeurs are already assigned to another vehicle' });
        }

        const voiture = await prisma.voiture.create({
            data: {
                matricule,
                id_chauffeur,
                id_chauffeur2,
                status,
            },
        });

        res.status(201).json(voiture);
    } catch (err) {
        res.status(500).json({ message: 'Error creating vehicle', error: (err as Error).message });
    }
};

// Lire les informations d'une voiture
export const getVoiture = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const voiture = await prisma.voiture.findUnique({
            where: { id },
            include: { chauffeur: true, chauffeur2: true },
        });

        if (!voiture) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json(voiture);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving vehicle', error: (err as Error).message });
    }
};

// Lire toutes les voitures
export const getAllVoitures = async (req: Request, res: Response) => {
    try {
        const voitures = await prisma.voiture.findMany({
            include: { chauffeur: true, chauffeur2: true },
        });

        res.json(voitures);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving vehicles', error: (err as Error).message });
    }
};

// Mettre à jour une voiture
export const updateVoiture = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { matricule, id_chauffeur, id_chauffeur2, status } = req.body;

    try {
        const updatedVoiture = await prisma.voiture.update({
            where: { id },
            data: {
                matricule,
                id_chauffeur,
                id_chauffeur2,
                status,
            },
        });

        res.json(updatedVoiture);
    } catch (err) {
        res.status(500).json({ message: 'Error updating vehicle', error: (err as Error).message });
    }
};

// Supprimer une voiture
export const deleteVoiture = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.voiture.delete({
            where: { id },
        });

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting vehicle', error: (err as Error).message });
    }
};
