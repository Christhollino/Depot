import { Router } from 'express';
import { authenticateJWT } from '../../middlewares/authMiddleware';
import { createReservation, updateReservation, getAllReservation } from '../../controllers/cooperative/reservation';

const router = Router();

// Routes pour les réservations
router.get('/', authenticateJWT, getAllReservation);
router.post('/create', authenticateJWT, createReservation);
router.put('/update/:id', authenticateJWT, updateReservation);

export default router;
