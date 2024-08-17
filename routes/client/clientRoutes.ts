import { Router } from 'express';
import { getVoyages, searchVoyagesByCooperative, searchVoyagesByDate } from '../../controllers/client/voyage';
import { reservePlace } from '../../controllers/client/place';

import { authenticateJWT } from '../../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/voyages', getVoyages);
router.get('/voyages/date', searchVoyagesByDate);
router.get('/voyages/cooperative', searchVoyagesByCooperative);
router.post('/places/:id/reserve', reservePlace);


export default router;
