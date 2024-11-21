import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// Routes
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();

app.use(express.json());

// Ruta principal
app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola, Mundo desde Node.js y Prisma!');
});

// Usa las rutas definidas
app.use('/users', userRoutes);

// Iniciar el servidor
const HOST : string = process.env.HOST || 'http://localhost';
const PORT: number = parseInt(process.env.PORT || '3000');
app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${HOST}:${PORT}`);
});