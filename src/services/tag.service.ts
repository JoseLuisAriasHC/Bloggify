import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const TagService = {
  async createTag(name: string) {
    const tag = await prisma.tag.create({ data: { name } });
    return tag;
  },

  async addTagsToPost(postId: number, tagIds: number[]) {
    const postTags = await prisma.postTag.createMany({
      data: tagIds.map((tagId) => ({
        postId,
        tagId
      })),
      skipDuplicates: true,
    });
    return postTags;
  },
};
