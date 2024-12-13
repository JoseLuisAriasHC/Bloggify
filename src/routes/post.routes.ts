import { Router } from "express";
import { createPost } from "../controllers/post.controller";
import { authenticateToken } from "../middlewares/middlewares";

const router = Router();

router.post('/', authenticateToken, createPost);

export default router;