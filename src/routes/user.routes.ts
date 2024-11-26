import { Router } from 'express';
import { getUserById } from '../controllers/user.controller';

const router = Router();
router.get('/', getUserById);
router.get('/:id', getUserById);
// router.post('/', UserController.createUser);

export default router;