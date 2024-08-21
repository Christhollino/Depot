import { Router } from 'express';
import { createVoyage, getVoyages, deleteVoyage } from '../../controllers/cooperative/voyages';

const router = Router();

router.post('/create', createVoyage);
router.get('/', getVoyages);
router.delete('/voyages/:id', deleteVoyage);

export default router;
