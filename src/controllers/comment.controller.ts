import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";
import { PostService } from "../services/post.service";

export const createComment = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const { content, postId } = req.body;

    const contentValidation = validateContent(content);
    if (contentValidation.status !== 200) {
      res
        .status(contentValidation.status)
        .json({ message: contentValidation.message });
      return;
    }

    const postValidation = await validatePostId(postId);
    if (postValidation.status !== 200) {
      res
        .status(postValidation.status)
        .json({ message: postValidation.message });
      return;
    }

    const newComment = await CommentService.createComment({
      content,
      postId,
      authorId: user.id,
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error al crear comentario", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const commentId = parseInt(req.params.id);
    const { content } = req.body;

    const contentValidation = validateContent(content);
    if (contentValidation.status !== 200) {
      res
        .status(contentValidation.status)
        .json({ message: contentValidation.message });
      return;
    }

    const commentIdValidation = await validateCommentId(commentId);
    if (commentIdValidation.status !== 200) {
      res
        .status(commentIdValidation.status)
        .json({ message: commentIdValidation.message });
      return;
    }

    if (commentIdValidation.comment?.authorId !== user.id) {
      res
        .status(403)
        .json({ message: "No tienes permiso para modificar el comentario" });
      return;
    }

    const newComment = await CommentService.updateComment(commentId, {
      content,
    });
    res.status(200).json(newComment);
  } catch (error) {
    console.error("Error al actualizar comentario", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

function validateContent(content: string) {
  if (!content || content.trim() === "") {
    return { status: 400, message: "El comentario no puede estar vacío" };
  }
  if (content.length < 3 || content.length > 800) {
    return {
      status: 400,
      message: "El comentario debe tener entre 3 a 800 caractere",
    };
  }
  return { status: 200, message: "ok" };
}

async function validatePostId(postId: number) {
  if (isNaN(postId) || postId <= 0) {
    return { status: 400, message: "Id de post inválido" };
  }

  const post = await PostService.getPost(postId);
  if (!post) {
    return { status: 404, message: "Post no encontrado" };
  }
  return { status: 200, message: "ok" };
}

async function validateCommentId(commentId: number) {
  if (isNaN(commentId) || commentId <= 0) {
    return { status: 400, message: "Id de comentario inválido" };
  }

  const comment = await CommentService.getCommentById(commentId);
  if (!comment) {
    return { status: 404, message: "Comentario no encontrado" };
  }

  return { status: 200, message: "ok", comment: comment };
}
