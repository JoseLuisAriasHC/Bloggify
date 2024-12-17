import { Router } from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
} from "../controllers/post.controller";
import { authenticateToken } from "../middlewares/middlewares";

const router = Router();

router.get("/:id", getPost);

router.use(authenticateToken);

router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
