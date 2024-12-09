import { Router } from "express";
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateUserIcon,
  updateUserPassword,
} from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);

router.get("/:id", getUserById);

router.put("/:id", updateUser);
router.patch("/:id/icon", updateUserIcon);
router.patch("/:id/password", updateUserPassword);

router.delete("/:id", deleteUser);

export default router;
