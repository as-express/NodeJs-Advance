import 'reflect-metadata';
import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import databaseConfig from './src/database/database.connection';
import authRoutes from './src/routes/auth.routes';
import userRoutes from './src/routes/user.routes';
import cookieParser from 'cookie-parser'
import 'colors';
dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

databaseConfig.initialize().then(() => {
  console.log(`Database connected successful`.bgBlue);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`.bgGreen);
});
