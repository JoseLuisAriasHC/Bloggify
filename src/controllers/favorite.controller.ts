import { Request, Response } from "express";
import { FavoriteService } from "../services/favorite.service";
import { PostService } from "../services/post.service";

export const createFavorite = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const { postId } = req.body;

    const post = validatePostId(postId, res);
    if (!post) return;

    const newFavorite = FavoriteService.createFavorite({
      postId,
      userId: user.id,
    });
    res.status(201).json(newFavorite);
  } catch (error) {
    console.error("Error al actualizar comentario", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const favoriteId = parseInt(req.params.id);

    const favorite = await validateFavoriteId(favoriteId, res);
    if (!favorite) return;

    if (favorite.userId !== user.id) {
      res
        .status(403)
        .json({ message: "No tienes permiso para modificar este recurso" });
      return;
    }

    await FavoriteService.deleteFavorite(favoriteId);
    res.status(200).json({ message: "Post eliminado de favoritos con exito" });
  } catch (error) {
    console.error("Error al actualizar comentario", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

async function validateFavoriteId(id: number, res: Response) {
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "Id de favorite inválido" });
    return;
  }

  const favorite = await FavoriteService.getFavorite(id);
  if (!favorite) {
    res.status(404).json({ message: "Favorito no encontrado" });
    return;
  }

  return favorite;
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
