import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const UserService = {
  async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  async createUser(data: {name: string, email: string, password: string, icon: string, biography: string }) {
    try {
      return await prisma.user.create({
        data,
      });
    } catch (error: any) {
      if (error.code === "P2002" && error.meta.target.includes("email")) {
        throw new Error("Email already in use");
      }
      throw error;
    }
  },

  async deleteUser(id: number){
    return await prisma.user.delete({
      where: {id},
    });
  },

  async updateUser(id: number, data: {name?: string, email?: string, icon?: string, biography?: string}){
    try {
      return await prisma.user.update({
        where: {id},
        data,
      });
    } catch (error: any) {
      if (error.code === "P2002" && error.meta.target.includes("email")) {
        throw new Error("Email already in use");
      }
      throw error;
    }
  },

  async getUserByEmail(email: string){
    return await prisma.user.findUnique({
      where: {email},
    })
  }
};