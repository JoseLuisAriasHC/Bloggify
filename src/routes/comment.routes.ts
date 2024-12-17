import { Router } from "express";
import { createComment, updateComment } from "../controllers/comment.controller";
import { authenticateToken } from "../middlewares/middlewares";

const router = Router();

router.use(authenticateToken);

router.post("/", createComment);
router.patch("/:id", updateComment);

export default router;
