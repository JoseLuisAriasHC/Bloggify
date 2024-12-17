import { Router } from "express";
import { createFavorite, deleteFavorite } from "../controllers/favorite.controller";
import { authenticateToken } from "../middlewares/middlewares";

const router = Router();

router.use(authenticateToken);

router.post('/login', createFavorite);
router.delete('/:id',deleteFavorite)

export default router;