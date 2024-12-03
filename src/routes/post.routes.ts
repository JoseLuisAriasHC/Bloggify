import { Router } from "express";
import { createPost } from "../controllers/post.controller";

const router = Router();

router.post('/', createPost);



export default router;