import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const FavoriteService = {
  async createFavorite(data: { postId: number; userId: number }) {
    return await prisma.favorites.create({ data });
  },

  async deleteFavorite(id: number) {
    return await prisma.favorites.delete({ where: { id } });
  },

  async getFavorite(id: number) {
    return await prisma.favorites.findUnique({ where: { id } });
  },
};
