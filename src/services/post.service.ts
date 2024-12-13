import { PrismaClient } from "@prisma/client";
import { title } from "process";

const prisma = new PrismaClient();

export const PostService = {
  async createPost(data: {
    title: string;
    content: string;
    summary: string;
    imageUrl: string;
    authorId: number;
  }) {
    const slug = await generateSlug(title);
    const post = await prisma.post.create({
      data: {
        ...data,
        slug: slug,
      },
    });

    return post;
  },

  async updatePost(
    id: number,
    data: {
      title: string;
      content: string;
      summary: string;
      imageUrl: string;
    }
  ) {
    const newPost = await prisma.post.update({
      where: { id },
      data,
    });

    return newPost;
  },

  async deletePost(id: number) {
    return await prisma.post.delete({ where: { id } });
  },
};

// Verificar si el slug base ya existe y generar un slug unico si es necesario
async function generateSlug(title: string): Promise<string> {
  const slugBase = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let uniqueSlug = slugBase;
  let count = 1;

  while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slugBase}-${count}`;
    count++;
  }
  return uniqueSlug;
}
