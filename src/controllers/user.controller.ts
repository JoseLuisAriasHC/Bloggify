import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export const UserController = {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers(); // Llama al servicio
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const { name, email } = req.body;
      const user = await UserService.createUser({ name, email }); // Llama al servicio
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  },
};
