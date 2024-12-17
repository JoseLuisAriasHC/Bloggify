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

router.use(authenticateToken);

router.put("/", updateUser);
router.patch("/settings/icon", updateUserIcon);
router.patch("/settings/password", updateUserPassword);

router.delete("/", deleteUser);

export default router;
