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

router.put("/", authenticateToken, updateUser);
router.patch("/settings/icon", authenticateToken, updateUserIcon);
router.patch("/settings/password", authenticateToken, updateUserPassword);

router.delete("/", authenticateToken, deleteUser);

export default router;
