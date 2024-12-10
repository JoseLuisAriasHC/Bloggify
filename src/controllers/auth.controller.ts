import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { comparePasswords, generateToken } from "../utils/utils";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ message: "El email y la contraseña son requeridos" });
      return;
    }

    const user = await UserService.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Correo o contraseña incorrectos" });
      return;
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Correo o contraseña incorrectos" });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        icon: user.icon,
        biography: user.biography,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const userFromToken = res.locals.user;

    const newToken = generateToken({id: userFromToken.id, email: userFromToken.email});

    res.status(200).json({
      message: "Token renovado exitosamente",
      token: newToken,
    });
  } catch (error) {
    console.error("Error al renovar token", error);
    res.status(500).json({ message: "Erro interno del servidor"});
  }
};