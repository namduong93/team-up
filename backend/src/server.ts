import express, { json, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { serverAddress } from '../config/serverAddressConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;
import { dbConfig } from '../config/dbConfig.js';
import { SqlDbUserRepository } from './repository/user/sqldb.js';
import { UserService } from './services/user_service.js';
import { UserController } from './controllers/user_controller.js';

const { HOST, PORT } = serverAddress;
const app = express();
app.use(json());
app.use(cors());
app.use(morgan('dev'));

const pool = new Pool({
  user: dbConfig.DB_USER,
  host: dbConfig.DB_HOST,
  database: dbConfig.DB_NAME,
  password: dbConfig.DB_PASSWORD,
  port: Number(dbConfig.DB_PORT),
  max: 10,
});

const userRepository = new SqlDbUserRepository(pool);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use('/images', express.static(path.join(currentDir, '../../public/images')));

app.get('/', async (req: Request, res: Response) => {
});

app.post('/student/add', userController.addStudent);

const server = app.listen(Number(PORT), HOST, () => {
  console.log(`Listening on port ${PORT} ✨`);
})

process.on('SIGINT', () => {
  server.close(() => console.log('server closing'));
})