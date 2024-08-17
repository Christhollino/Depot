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

router.post('/', authenticateJWT, createChauffeur);
router.get('/:id', authenticateJWT, getChauffeur);
router.get('/', authenticateJWT, getAllChauffeurs);
router.put('/:id', authenticateJWT, updateChauffeur);
router.delete('/:id', authenticateJWT, deleteChauffeur);

export default router;
