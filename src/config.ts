import dotenv from "dotenv";
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '3000'),
  host: process.env.HOST || 'http://localhost',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "contraseña",
  jwtExpiration: process.env.JWT_EXPIRATION,
};

export default config;