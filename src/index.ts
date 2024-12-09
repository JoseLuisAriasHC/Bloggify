import express, { Request, Response } from 'express';
import config from './config';
// Routes
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import authRoutes from './routes/auth.routes';


const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola, Mundo desde Node.js y Prisma!');
});

app.use('/author', userRoutes);
app.use('/post', postRoutes);
app.use('/auth', authRoutes);

// Iniciar el servidor
const { host, port } = config;

app.listen(port, () => {
  console.log(`Servidor corriendo en ${host}:${port}`);
});