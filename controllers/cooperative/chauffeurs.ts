import { Request, Response } from 'express';
import prisma from '../../prismaClient';

// Créer un nouveau chauffeur
export const createChauffeur = async (req: Request, res: Response) => {
    const { name, lastname, num_tel, cin, adress } = req.body;

    try {
        const chauffeur = await prisma.chauffeur.create({
            data: { name, lastname, num_tel, cin, adress },
        });
        res.status(201).json(chauffeur);
    } catch (err) {
        res.status(500).json({ message: 'Error creating chauffeur', error: (err as Error).message });
    }
};

// Lire les informations d'un chauffeur
export const getChauffeur = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const chauffeur = await prisma.chauffeur.findUnique({
            where: { id },
        });

        if (!chauffeur) {
            return res.status(404).json({ message: 'Chauffeur not found' });
        }

        res.json(chauffeur);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving chauffeur', error: (err as Error).message });
    }
};

// Lire tous les chauffeurs
export const getAllChauffeurs = async (req: Request, res: Response) => {
    try {
        const chauffeurs = await prisma.chauffeur.findMany();
        res.json(chauffeurs);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving chauffeurs', error: (err as Error).message });
    }
};

// Mettre à jour un chauffeur
export const updateChauffeur = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, lastname, num_tel, cin, adress } = req.body;

    try {
        const updatedChauffeur = await prisma.chauffeur.update({
            where: { id },
            data: { name, lastname, num_tel, cin, adress },
        });

        res.json(updatedChauffeur);
    } catch (err) {
        res.status(500).json({ message: 'Error updating chauffeur', error: (err as Error).message });
    }
};

// Supprimer un chauffeur
export const deleteChauffeur = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.chauffeur.delete({
            where: { id },
        });

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting chauffeur', error: (err as Error).message });
    }
};
