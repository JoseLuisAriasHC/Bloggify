import { Request, Response } from "express";
import { PostService } from "../services/post.service";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, summary, imageUrl, authorId } = req.body;

    if (!title || title.trim() == "") {
      res.status(400).json({ message: "Title cannot be empty" });
      return;
    }
    if (!content || typeof content !== "object" || Object.keys(content).length === 0) {
      res.status(400).json({ message: "Content must be a non-empty JSON object or array" });
      return;
    }
    if (!summary || summary.trim() == "") {
      res.status(400).json({ message: "summary cannot be empty" });
      return;
    }
    if (!imageUrl || imageUrl.trim() == "") {
      res.status(400).json({ message: "imageUrl cannot be empty" });
      return;
    }
    if (!authorId || typeof authorId !== "number" || isNaN(authorId)) {
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
  } catch (error: any) {
    console.error(error);
    if (error.message === "User not found") {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(500).json({ error: "Error creating post" });
  }
};
