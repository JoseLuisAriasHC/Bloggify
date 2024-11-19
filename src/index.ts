import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

// Crear una instancia de PrismaClient
const prisma = new PrismaClient();

// Crear una aplicación de Express
const app = express();

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Ruta principal
app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola, Mundo desde Node.js y Prisma!');
});

// Iniciar el servidor
const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
