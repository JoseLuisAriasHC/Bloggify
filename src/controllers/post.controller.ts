import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { UserService } from "../services/user.service";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, summary, imageUrl, authorId } = req.body;

    const validatedPostInput = validatePostInput(title, content, summary, imageUrl);
    if (validatedPostInput.status != 200) {
      res.status(validatedPostInput.status).json({messge: validatedPostInput.message});
      return;
    }

    const author = await validateAuthorId(authorId, res);
    if (!author) return;

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

function validatePostInput(
  title: string,
  content: any,
  summary: string,
  imageUrl: string
) {
  let errorExists = validateTitle(title);
  if (errorExists) return errorExists;

  errorExists = validateContent(content);
  if (errorExists) return errorExists;

  errorExists = validateSummary(summary);
  if (errorExists) return errorExists;

  errorExists = validateImageUrl(imageUrl);
  if (errorExists) return errorExists;

  return {status: 200, message: "ok"};
}

function validateTitle(
  title: string
): { status: number; message: string } | null {
  if (!title || title.trim() == "") {
    return { status: 400, message: "El título no puede estar vacío" };
  }
  if (title.length < 3 || title.length > 100) {
    return {
      status: 400,
      message: "El título debe tener entre 3 a 100 caracteres",
    };
  }
  return null;
}

function validateContent(content: any): { status: number; message: string } | null  {
  if (
    !content ||
    typeof content !== "object" ||
    Object.keys(content).length === 0
  ) {
    return {status: 400, message: "El contenido no puede estar vacío"}
  }

  return null
}

function validateSummary(summary: string): { status: number; message: string } | null {
  if (!summary || summary.trim() == "") {
    return {status: 400, message: "El resumen no puede estar vacío"}
  }
  if (summary.length < 200 || summary.length > 600) {
    return {status: 400, message: "El resumen tiene que tener entre 200 a 600 caracteres"}
  }
  return null;
}

function validateImageUrl(imageUrl: string): { status: number; message: string } | null {
  if (!imageUrl || imageUrl.trim() == "") {
    return {status: 400, message: "La imagen no puede estar vacía"}
  }
  if (!/^(https?:\/\/)[^\s$.?#].[^\s]*$/.test(imageUrl)) {
    return {status: 400, message: "La imagen tiene que ser una URL válida"}
  }
  return null;
}

async function validateAuthorId (id: number, res: Response){
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "Id de autor inválido" });
    return;
  }

  const user = await UserService.getUserById(id);
  if (!user) {
    res.status(404).json({ message: "Autor no encontrado" });
    return;
  }

  return user;
};