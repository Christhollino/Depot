import express from 'express';
import { authenticateJWT } from '../../middlewares/authMiddleware';
import {
    createVoiture,
    getVoiture,
    getAllVoitures,
    updateVoiture,
    deleteVoiture,
} from '../../controllers/cooperative/voitures';

const router = express.Router();

router.post('/', authenticateJWT, createVoiture);
router.get('/:id', authenticateJWT, getVoiture);
router.get('/', authenticateJWT, getAllVoitures);
router.put('/:id', authenticateJWT, updateVoiture);
router.delete('/:id', authenticateJWT, deleteVoiture);

export default router;
