import { Request, Response } from "express";
import { TagService } from "../services/tag.service";

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const validatedName = validateName(name);
    if (validatedName.status != 200) {
      res.status(validatedName.status).json({ message: validatedName.message });
      return;
    }

    const tag = await TagService.createTag(name);
    res.status(201).json(tag);
  } catch (error) {
    console.error("Error al crear tag", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const assignTagsToPost = async (req: Request, res: Response) => {
  try {
    const { postId, tagIds } = req.body;

    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      res.status(400).json({ message: "Se requiere una lista de etiquetas" });
      return;
    }

    const postTags = await TagService.addTagsToPost(postId, tagIds);
    res.status(200).json(postTags);
  } catch (error) {
    console.error("Error al asginar un tag a un post", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

function validateName(name: string) {
  if (!name || name.trim() === "") {
    return {
      status: 400,
      message: "El nombre de la etiqueta no puede estar vacío",
    };
  }
  if (name.length < 3 || name.length > 25) {
    return {
      status: 400,
      message:
        "El nombre de la etiqueta tiene que tener entre 3 a 25 caracteres",
    };
  }

  return { status: 200, message: "ok" };
}
