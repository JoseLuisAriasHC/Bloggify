import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const UserController = {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await prisma.user.findUnique({
        where: { id },
      });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener usuario por ID" });
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const user = await prisma.user.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear usuario" });
    }
  },

  async deleteUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      prisma.user.delete({
        where: {id}
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al borrar usuario" });
    }
  },
};
