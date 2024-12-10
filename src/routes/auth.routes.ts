import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/middlewares";

const router = Router();

router.post('/login', login);
router.post('/refresh', authenticateToken, login);

export default router;