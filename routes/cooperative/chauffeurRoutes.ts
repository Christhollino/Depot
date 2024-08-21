import express from 'express';
import { authenticateJWT } from '../../middlewares/authMiddleware';
import {
    createChauffeur,
    getChauffeur,
    getAllChauffeurs,
    updateChauffeur,
    deleteChauffeur,
} from '../../controllers/cooperative/chauffeurs';

const router = express.Router();

router.post('/create', authenticateJWT, createChauffeur);
router.get('/:id', authenticateJWT, getChauffeur);
router.get('/', authenticateJWT, getAllChauffeurs);
router.put('/update/:id', authenticateJWT, updateChauffeur);
router.delete('/delet/:id', authenticateJWT, deleteChauffeur);

export default router;
