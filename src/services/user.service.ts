import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const UserService = {
  async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }
};