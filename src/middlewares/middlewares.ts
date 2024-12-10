import { Request, Response, NextFunction } from "express";
import  Jwt  from "jsonwebtoken";
import config from "../config";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token no proporcionado'});
        return;
    }

    try {
        const decoded  = Jwt.verify(token, config.jwtSecret!);
        req.cookies = decoded;
        res.locals.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token no válido '});
    }
}