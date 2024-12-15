import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, icon, biography } = req.body;

    const validatedUserInput = validateUserInput(name, email, icon, biography);
    if (validatedUserInput.status !== 200) {
      res
        .status(validatedUserInput.status)
        .json({ message: validatedUserInput.message });
      return;
    }

    const errorPassword = validatePassword(password);
    if (errorPassword) {
      res.status(errorPassword.status).json({ message: errorPassword.message });
      return;
    }

    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: "El correo electrónico esta en uso" });
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    await UserService.deleteUser(user.id);
    res.status(200).json({ message: "Usuario elimando con exito" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const { name, email, icon, biography } = req.body;

    const validatedUserInput = validateUserInput(name, email, icon, biography);
    if (validatedUserInput.status !== 200) {
      res
        .status(validatedUserInput.status)
        .json({ message: validatedUserInput.message });
      return;
    }

    const updatedUser = await UserService.updateUser(user.id, {
      name,
      email,
      icon,
      biography,
    });
    res.json(updatedUser);
  } catch (error: any) {
    if (error.message === "E-mail is already use") {
      res.status(404).json({ error: "Correo electrónico en uso" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const updateUserIcon = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const { icon } = req.body;

    const errorIcon = validateIcon(icon);
    if (errorIcon) {
      res.status(errorIcon.status).json({ message: errorIcon.message });
      return;
    }

    const updatedUser = await UserService.updateUser(user.id, { icon });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const { password } = req.body;

    const errorPassword = validatePassword(password);
    if (errorPassword) {
      res.status(errorPassword.status).json({ message: errorPassword.message });
      return;
    }

    const updatedUser = await UserService.updateUser(user.id, { password });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
      res.status(400).json({ message: "Id de usuario inválido" });
      return;
    }
  
    const user = await UserService.getUserById(id);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function validateUserInput(
  name: string,
  email: string,
  icon: string,
  biography: string
): { status: number; message: string } {
  let errorExists = validateUserName(name);
  if (errorExists) return errorExists;

  errorExists = validateEmail(email);
  if (errorExists) return errorExists;

  errorExists = validateIcon(icon);
  if (errorExists) return errorExists;

  errorExists = validateBiography(biography);
  if (errorExists) return errorExists;

  return { status: 200, message: "ok" };
}

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
  if (!/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(name)) {
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
  if (!/^(https?:\/\/)[^\s$.?#].[^\s]*$/.test(icon)) {
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