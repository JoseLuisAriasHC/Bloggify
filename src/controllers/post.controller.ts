import { Request, Response } from "express";
import { PostService } from "../services/post.service";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, summary, imageUrl, authorId } = req.body;

    if (!title || !content || !summary || !imageUrl || !authorId) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (!authorId || isNaN(authorId)) {
      res.status(400).json({ message: "Author ID is invalid" });
      return;
    }

    const newPost = await PostService.createPost({
      title,
      content,
      summary,
      imageUrl,
      authorId,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating post" });
  }
};
