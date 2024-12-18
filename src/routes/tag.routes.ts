import { Router } from "express";
import { createTag, assignTagsToPost } from "../controllers/tag.controller";

const router = Router();

router.post("/", createTag);
router.post("/assign", assignTagsToPost);

export default router;