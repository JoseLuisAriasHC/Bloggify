import { PrismaClient, Prisma } from "@prisma/client";
import { JsonArray } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const PostService = {
  async createPost(data: Prisma.PostCreateInput) {
    await prisma.post.create({data});
  },
};
