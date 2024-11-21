import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserService = {
  async getAllUsers() {
    // Obtiene todos los usuarios desde la base de datos
    return await prisma.user.findMany();
  },

  async createUser(data: any) {
    // Crea un nuevo usuario en la base de datos
    return await prisma.user.create({ data });
  },
};
