import { Request, Response } from 'express';
import prisma from '../../prismaClient';
import { authenticateJWT } from '../../middlewares/authMiddleware';
export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const utilisateur = req.user;
    if (!utilisateur) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }
    // Si l'utilisateur est lié à une coopérative
    if (utilisateur.role === 'COOPERATIVE') {
      if (utilisateur.id_cooperative) {
        const cooperativeData = await prisma.cooperative.findUnique({
          where: { id: utilisateur.id_cooperative! },
          include: {
            chauffeurs: true,
            reservations: {
              include: {
                voyages: {
                  where: {
                    start: {
                      gte: new Date(), // Voyages actifs à partir d'aujourd'hui
                    },
                  },
                },
              },
            },
          },
        });
        if (cooperativeData) {
          // Renvoyer les données nécessaires
          return res.json({
            chauffeurs: cooperativeData.chauffeurs.length, // Nombre de chauffeurs
            voyagesActifs: cooperativeData.reservations.flatMap((reservation) =>
              reservation.voyages.map((voyage) => ({
                destination: voyage.arrived,
                heureDepart: voyage.start,
              }))
            ),
          });
        } else {
          return res.status(404).json({ error: 'Coopérative introuvable' });
        }
      } else {
        return res.status(404).json({ error: 'ID de la coopérative manquant' });
      }
    }
    // Si l'utilisateur n'a pas un rôle reconnu
    return res.status(403).json({ error: 'Rôle non autorisé' });
  } catch (error) {
    console.error('Erreur lors de la récupération des données du dashboard:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};