import { Request, Response } from 'express';
import prisma from '../../prismaClient';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../../middlewares/authMiddleware';

// Créer un nouveau chauffeur
export const createChauffeur = async (req: Request, res: Response) => {
    const { name, lastname, num_tel, cin, adress } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { id: req.user.id },
        });

        if (!utilisateur || !utilisateur.id_cooperative) {
            return res.status(404).json({ message: 'Cooperative not found for this user' });
        }

        const cooperativeId = utilisateur.id_cooperative;

        const existingNumTel = await prisma.chauffeur.findUnique({
            where: { num_tel },
        });

        const existingCin = await prisma.chauffeur.findUnique({
            where: { cin },
        });

        if (existingNumTel) {
            return res.status(400).json({ message: 'Le numéro de téléphone existe déjà.', field: 'num_tel' });
        }

        if (existingCin) {
            return res.status(400).json({ message: 'Le CIN existe déjà.', field: 'cin' });
        }

        const chauffeur = await prisma.chauffeur.create({
            data: { name, lastname, num_tel, cin, adress, cooperativeId },
        });

        res.status(201).json({ message: 'Chauffeur créé avec succès', chauffeur });
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
            include: {
                cooperative: true,
            },
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
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const chauffeurs = await prisma.chauffeur.findMany({
            where: { cooperativeId: req.user.id_cooperative },
            include: {
                cooperative: true,
            },
        });
        res.json(chauffeurs);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving chauffeurs', error: (err as Error).message });
    }
};


// Mettre à jour un chauffeur
export const updateChauffeur = async (req: Request, res: Response) => {
    const { id } = req.params; // l'ID du chauffeur à mettre à jour
    const { name, lastname, num_tel, cin, adress } = req.body; // les nouvelles données du chauffeur

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const utilisateur = await prisma.utilisateur.findUnique({
             where: { id: req.user.id },
             include: { cooperative: true }, // Incluez la coopérative associée
         });
         // Vérifiez si l'utilisateur est bien associé à une coopérative
         if (!utilisateur || !utilisateur.cooperative) {
             return res.status(403).json({ message: 'User not associated with any cooperative' });
         }
         const cooperativeId = utilisateur.cooperative.id;
         // Mise à jour du chauffeur en vérifiant qu'il appartient à la même coopérative
         const updatedChauffeur = await prisma.chauffeur.updateMany({
             where: { id, cooperativeId },
             data: { name, lastname, num_tel, cin, adress },
         });
 
         if (!updatedChauffeur.count) {
             return res.status(404).json({ message: 'Chauffeur not found or not associated with your cooperative' });
         }
 
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
