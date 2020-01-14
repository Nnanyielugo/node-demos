import { Router } from 'express';
import { save } from './controller';

const router = Router();

router.post('/rotation', save)

export default router;