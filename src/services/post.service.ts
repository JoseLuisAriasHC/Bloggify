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
    const slug = await generateSlug(undefined, data.title);
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
    const slug = await generateSlug(id, data.title);
    const newPost = await prisma.post.update({
      where: { id },
      data: {
        ...data,
        slug: slug,
      },
    });

    return newPost;
  },

  async deletePost(id: number) {
    return await prisma.post.delete({ where: { id } });
  },

  async getPostById(id: number) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        comments: true,
        tags: true,
      },
    });
  },

  async getPostsByTag(tagId: number){
    const post = await prisma.post.findMany({
        where: {
            tags: {
                some: { tagId },
            },
        },
        include: {
            tags: true,
        }
    });
    return post;
  }
};

// Verificar si el slug base ya existe y generar un slug unico si es necesario
async function generateSlug(id: number | undefined, title: string): Promise<string> {
  const slugBase = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let uniqueSlug = slugBase;
  let count = 1;

  while (true) {
    const existingPost = await prisma.post.findUnique({ where: { slug: uniqueSlug } });

    if (!existingPost) {
      break;
    }

    if (id && existingPost.id === id) {
      return uniqueSlug;
    }

    uniqueSlug = `${slugBase}-${count}`;
    count++;
  }

  return uniqueSlug;
}
