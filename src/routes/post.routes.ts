import { Router } from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
} from "../controllers/post.controller";
import { authenticateToken } from "../middlewares/middlewares";

const router = Router();

router.get("/:id", authenticateToken, getPost);
router.post("/", authenticateToken, createPost);
router.put("/:id", authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);

export default router;
