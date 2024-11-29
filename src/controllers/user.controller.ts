import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, icon, biography } = req.body;

    const validatedUserInput = validateUserInput(
      name,
      email,
      password,
      icon,
      biography
    );
    if (validatedUserInput.status !== 200) {
      res
        .status(validatedUserInput.status)
        .json({ message: validatedUserInput.message });
      return;
    }

    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const newUser = await UserService.createUser({
      name,
      email,
      password,
      icon,
      biography,
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "User not found" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

function validateUserInput(
  name: string,
  email: string,
  password: string,
  icon: string,
  biography: string
): { status: number; message: string } {
  let validationError = validateUserName(name);
  if (validationError) return validationError;

  validationError = validateEmail(email);
  if (validationError) return validationError;

  validationError = validatePassword(password);
  if (validationError) return validationError;

  validationError = validateIcon(icon);
  if (validationError) return validationError;

  validationError = validateBiography(biography);
  if (validationError) return validationError;

  return { status: 200, message: "ok" };
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    await UserService.deleteUser(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "User not found" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const { name, email, icon, biography } = req.body;
    if (!name && !email && !icon && !biography) {
      res.status(400).json({
        message: "At least one field (name, email, icon) is required to update",
      });
      return;
    }

    const userUpdate = await UserService.updateUser(id, {
      name,
      email,
      icon,
      biography,
    });
    res.json(userUpdate);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "User not found" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    // verificar si hay id
    if (!req.params.id) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
    const id = parseInt(req.params.id);
    // verificar que el id es Number
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await UserService.getUserById(id);
    // verificar que hay un usuario con ese ID
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function validateUserName(
  name: string
): { status: number; message: string } | null {
  if (!name || name.trim() === "") {
    return { status: 400, message: "El nomber no puede estar vacío" };
  }
  if (name.length < 3 || name.length > 50) {
    return {
      status: 400,
      message: "El nombre debe tener entre 3 a 50 caracteres",
    };
  }
  if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
    return {
      status: 400,
      message: "El nomber solo puede tener letras, numeros y espacios",
    };
  }
  return null;
}

function validateEmail(
  email: string
): { status: number; message: string } | null {
  if (!email || email.trim() == "") {
    return { status: 400, message: "El email no puede estar vacío" };
  }
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return { status: 400, message: "Formato de email erroneo" };
  }
  return null;
}

function validatePassword(
  password: string
): { status: number; message: string } | null {
  if (!password || password.trim() == "") {
    return { status: 400, message: "La contraseña no puede estar vacia" };
  }
  if (password.length < 8) {
    return {
      status: 400,
      message: "La contraseña debete tener al menos 8 caracteres",
    };
  }
  if (
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    return {
      status: 400,
      message:
        "La contraseña debe tener una letra mayúscula, una minúscula y un número",
    };
  }
  return null;
}

function validateIcon(
  icon: string
): { status: number; message: string } | null {
  if (!icon || icon.trim() === "") {
    return { status: 400, message: "El icono no puede estar vacío" };
  }
  if (
    !/^https?:\/\/(?:[\w-]+\.)+[a-z]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i.test(icon)
  ) {
    return {
      status: 400,
      message: "El icono debe ser una URL válida",
    };
  }
  
  return null;
}

function validateBiography(
  biography: string
): { status: number; message: string } | null {
  if (!biography || biography.trim() == "") {
    return { status: 400, message: "La biografía no puede estar vacía" };
  }
  if (biography.length > 300) {
    return {
      status: 400,
      message: "La biografía no puede exceder los 300 caracteres",
    };
  }
  return null;
}
