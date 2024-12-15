import { Request, Response } from "express";
import { PostService } from "../services/post.service";

export const createPost = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const { title, content, summary, imageUrl } = req.body;

    const validatedPostInput = validatePostInput(
      title,
      content,
      summary,
      imageUrl
    );
    if (validatedPostInput.status != 200) {
      res
        .status(validatedPostInput.status)
        .json({ messge: validatedPostInput.message });
      return;
    }

    const newPost = await PostService.createPost({
      title,
      content,
      summary,
      imageUrl,
      authorId: user.id,
    });

    res.status(201).json(newPost);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const postId = parseInt(req.params.id);
    const { title, content, summary, imageUrl, authorId } = req.body;

    if (user.id !== authorId) {
      res
        .status(403)
        .json({ message: "No tienes permiso para modificar este recurso" });
      return;
    }

    const post = await validatePostId(postId, res);
    if (!post) return;

    const validatedPostInput = validatePostInput(
      title,
      content,
      summary,
      imageUrl
    );
    if (validatedPostInput.status != 200) {
      res
        .status(validatedPostInput.status)
        .json({ message: validatedPostInput.message });
      return;
    }

    const newPost = await PostService.updatePost(postId, {
      title,
      content,
      summary,
      imageUrl,
    });

    res.status(200).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const id = parseInt(req.params.id);

    const post = await validatePostId(id, res);
    if (!post) return;

    if (user.id !== post.authorId) {
      res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este recurso" });
      return;
    }

    await PostService.deletePost(id);
    res.status(200).json({ message: "Post elimando con exito" });
  } catch (error) {
    console.error(error);
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const post = await validatePostId(id, res);
    if (!post) return;

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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

  return { status: 200, message: "ok" };
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

function validateContent(
  content: any
): { status: number; message: string } | null {
  if (
    !content ||
    typeof content !== "object" ||
    Object.keys(content).length === 0
  ) {
    return { status: 400, message: "El contenido no puede estar vacío" };
  }

  return null;
}

function validateSummary(
  summary: string
): { status: number; message: string } | null {
  if (!summary || summary.trim() == "") {
    return { status: 400, message: "El resumen no puede estar vacío" };
  }
  if (summary.length < 100 || summary.length > 600) {
    return {
      status: 400,
      message: "El resumen tiene que tener entre 200 a 600 caracteres",
    };
  }
  return null;
}

function validateImageUrl(
  imageUrl: string
): { status: number; message: string } | null {
  if (!imageUrl || imageUrl.trim() == "") {
    return { status: 400, message: "La imagen no puede estar vacía" };
  }
  if (!/^(https?:\/\/)[^\s$.?#].[^\s]*$/.test(imageUrl)) {
    return { status: 400, message: "La imagen tiene que ser una URL válida" };
  }
  return null;
}

async function validatePostId(id: number, res: Response) {
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "Id de post inválido" });
    return;
  }

  const post = await PostService.getPost(id);
  if (!post) {
    res.status(404).json({ message: "Post no encontrado" });
    return;
  }

  return post;
}
