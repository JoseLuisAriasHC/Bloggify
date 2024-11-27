import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const {name, email, password, icon, biography} = req.body;
    if (!name || !email || !password || !icon || ! biography) {
      res.status(400).json({message: "Name, email, password, icon, biography are required"});
      return;
    }

    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const newUser = await UserService.createUser({name, email, password, icon, biography});
    res.status(201).json(newUser);
    
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "User not found" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({message: "Invalid user ID"});
      return;
    }

    await UserService.deleteUser(id);
    res.status(200).json({message: "User deleted successfully"})
    
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "User not found" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const updateUser = async (req:Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid user ID"});
      return;
    }

    const { name, email, icon, biography} = req.body;
    if (!name && !email && !icon && !biography) {
      res.status(400).json({ message: "At least one field (name, email, icon) is required to update" })
      return;
    }

    const userUpdate = await UserService.updateUser(id,{ name, email, icon, biography});
    res.json(userUpdate);

  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "User not found" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

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