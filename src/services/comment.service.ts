import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CommentService = {
  async createComment(data: {
    content: string;
    postId: number;
    authorId: number;
  }) {
    return await prisma.comment.create({ data });
  },

  async updateComment(
    id: number,
    data: {
      content: string;
    }
  ) {
    return await prisma.comment.update({
      where: { id },
      data,
    });
  },

  async getCommentById(id: number) {
    return await prisma.comment.findUnique({ where: { id } });
  },
};
