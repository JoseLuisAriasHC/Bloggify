import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PostService = {
  async createPost(data: {
    title: string;
    content: string;
    summary: string;
    imageUrl: string;
    authorId: number;
  }) {
     // Verificar si el autor existe
     const authorExists = await prisma.user.findUnique({ where: { id: data.authorId } });
     if (!authorExists) {
       throw new Error("User not found");
     }

    // Verificar si el slug base ya existe y generar un slug unico si es necesario
    const slugBase = generateSlug(data.title);
    let uniqueSlug = slugBase;
    let count = 1;

    while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slugBase}-${count}`;
      count++;
    }

    const post = await prisma.post.create({
      data: {
        ...data,
        slug: uniqueSlug,
      },
    });

    return post;
  },

};

function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return baseSlug;
}
