import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export const getUserById = async (req: Request, res: Response) => {
  try {
    // verificar si hay id
    if (!req.params.id) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
    const id = parseInt(req.params.id);
    // verificar que el id es Number
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await UserService.getUserById(id);
    // verificar que hay un usuario con ese ID
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};