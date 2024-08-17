import { Router } from 'express';
import { createReservation, updateReservation } from '../../controllers/cooperative/reservation';

const router = Router();

// Routes pour les réservations
router.post('/reservations', createReservation);
router.put('/reservations/:id', updateReservation);

export default router;
