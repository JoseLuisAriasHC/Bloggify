import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { comparePasswords, generateToken } from "../utils/utils";

export const loginUser = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "El email y la contraseña son requeridos"});
        }

        const user = await UserService.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({message : "Credenciales inválidos"});
        }

        const isPasswordValid = await comparePasswords(password, user.password);
        if (isPasswordValid) {
            return res.status(401).json({ message: "Credenciales inválidos"});
        }

        const token = generateToken({id: user.id, email: user.email});

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            user
        });
        
    } catch (error) {
        console.error("Error al iniciar sesión", error);
        res.status(500).json({ message: "Error interno del servidor"});
    }
}