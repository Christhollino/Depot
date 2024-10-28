import { Request, Response } from 'express';
import prisma from '../../prismaClient';

// Créer une nouvelle voiture
export const createVoiture = async (req: Request, res: Response) => {
    const { matricule, id_chauffeur, id_chauffeur2 } = req.body;

    if (!req.user || !req.user.id) {
        console.log("user find....")
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { id: req.user.id },
            include: { cooperative: true },
        });
        if (!utilisateur || !utilisateur.cooperative) {
            return res.status(403).json({ message: 'User not associated with any cooperative' });
        }
        const cooperativeId = utilisateur.cooperative.id;

        const chauffeur1 = await prisma.chauffeur.findUnique({
            where: { id: id_chauffeur },
            include: { voitures: true },
        });

        const chauffeur2 = id_chauffeur2 ? await prisma.chauffeur.findUnique({
            where: { id: id_chauffeur2 },
            include: { voitures: true },
        }) : null;

        if ((chauffeur1 && chauffeur1.voitures.length > 0) || (chauffeur2 && chauffeur2.voitures.length > 0)) {
            return res.status(400).json({ message: 'One or both chauffeurs are already assigned to another vehicle' });
        }

        const existingMatricule = await prisma.voiture.findUnique({
            where: { matricule },
        });

        if (existingMatricule) {
            return res.status(400).json({ message: 'Le matricule existe déjà.', field: 'matricule' });
        }
        
        // Créer une nouvelle voiture
        const voiture = await prisma.voiture.create({
            data: {
                matricule,
                id_chauffeur,
                id_chauffeur2,
                cooperativeId,
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
            include: { chauffeur: true, chauffeur2: true, cooperative: true },
        });

        if (!voiture) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json(voiture);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving vehicle', error: (err as Error).message });
    }
};

// Lire toutes les voitures de la coopérative de l'utilisateur connecté
export const getAllVoitures = async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Trouver la coopérative de l'utilisateur
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { id: req.user.id },
            include: { cooperative: true },
        });
        if (!utilisateur || !utilisateur.cooperative) {
            return res.status(403).json({ message: 'User not associated with any cooperative' });
        }
        const cooperativeId = utilisateur.cooperative.id;

        // Récupérer toutes les voitures de cette coopérative
        const voitures = await prisma.voiture.findMany({
            where: { cooperativeId },
            include: { chauffeur: true, chauffeur2: true, cooperative: true },
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

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Trouver la coopérative de l'utilisateur
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { id: req.user.id },
            include: { cooperative: true },
        });
        if (!utilisateur || !utilisateur.cooperative) {
            return res.status(403).json({ message: 'User not associated with any cooperative' });
        }
        const cooperativeId = utilisateur.cooperative.id;
        // Mettre à jour la voiture seulement si elle appartient à la coopérative de l'utilisateur
        const updatedVoiture = await prisma.voiture.updateMany({
            where: { id, cooperativeId },
            data: {
                matricule,
                id_chauffeur,
                id_chauffeur2,
                status,
            },
        });

        if (!updatedVoiture.count) {
            return res.status(404).json({ message: 'Vehicle not found or not associated with your cooperative' });
        }

        res.json(updatedVoiture);
    } catch (err) {
        res.status(500).json({ message: 'Error updating vehicle', error: (err as Error).message });
    }
};

// Supprimer une voiture
export const deleteVoiture = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Trouver la coopérative de l'utilisateur
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { id: req.user.id },
            include: { cooperative: true },
        });
        if (!utilisateur || !utilisateur.cooperative) {
            return res.status(403).json({ message: 'User not associated with any cooperative' });
        }
        const cooperativeId = utilisateur.cooperative.id;
        // Supprimer la voiture si elle appartient à la coopérative de l'utilisateur
        await prisma.voiture.deleteMany({
            where: { id, cooperativeId },
        });

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting vehicle', error: (err as Error).message });
    }
};
