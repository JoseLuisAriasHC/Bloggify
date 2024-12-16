import { Router } from "express";
import { createComment, updateComment } from "../controllers/comment.controller";
import { authenticateToken } from "../middlewares/middlewares";

const router = Router();

router.post("/", authenticateToken, createComment);
router.patch("/:id", authenticateToken, updateComment);

export default router;
