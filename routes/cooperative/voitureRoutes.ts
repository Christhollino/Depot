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

router.post('/create', authenticateJWT, createVoiture);
router.get('/:id', authenticateJWT, getVoiture);
router.get('/', authenticateJWT, getAllVoitures);
router.put('/update/:id', authenticateJWT, updateVoiture);
router.delete('/delet/:id', authenticateJWT, deleteVoiture);

export default router;
