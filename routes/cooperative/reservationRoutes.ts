import { Router } from 'express';
import { createReservation, updateReservation } from '../../controllers/cooperative/reservation';

const router = Router();

// Routes pour les réservations
router.post('/create', createReservation);
router.put('/update/:id', updateReservation);

export default router;
