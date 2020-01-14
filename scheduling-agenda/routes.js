import { Router } from 'express';
import { save, update } from './controller';

const router = Router();

router.post('/rotation', save)
router.put('/rotation/:id', update)

export default router;