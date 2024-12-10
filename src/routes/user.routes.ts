import { Router } from "express";
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateUserIcon,
  updateUserPassword,
} from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/middlewares";

const router = Router();

router.post("/", createUser);

router.get("/:id", getUserById);

router.put("/:id", authenticateToken, updateUser);
router.patch("/:id/settings/icon", authenticateToken, updateUserIcon);
router.patch("/:id/settings/password", authenticateToken, updateUserPassword);

router.delete("/:id", authenticateToken, deleteUser);

export default router;
