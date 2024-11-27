import { Request, Response } from "express";
import { PostService } from "../services/post.service";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, summary, imageUrl, slug, authorId } = req.body;

    if (!title || !content || !summary || !imageUrl || !slug || !authorId) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const newPost = await PostService.createPost({
      title,
      content,
      summary,
      imageUrl,
      slug,
      author: { connect: { id: authorId } },
    });
  } catch (error) {}
};
