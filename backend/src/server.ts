import express, { json, request, Request, response, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { serverAddress } from '../config/serverAddressConfig.js';
import { dbConfig } from '../config/dbConfig.js';
import createHttpError, { HttpError } from 'http-errors';
import pg from 'pg';
const { Pool } = pg;


const { HOST, PORT } = serverAddress;
const app = express();
app.use(json());
app.use(cors());
app.use(morgan('dev'));

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = dbConfig;
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: Number(DB_PORT),
  max: 10,
});

type HTTPFunction = (req: Request, res: Response) => Promise<void>;

function httpErrorHandler(httpFunction: HTTPFunction) {
  return async function(req: Request, res: Response) {
    // Call given function and pass on any error status code/messages
    try {
      await httpFunction(req, res);
    } catch (err: unknown) {
      // dev: 
      console.log(err);
      
      if (createHttpError.isHttpError(err)) {
        // err is auto cast to a HttpError here.
        res.status(err.statusCode).json(err);
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  };
}

app.get('/', httpErrorHandler(async (req: Request, res: Response) => {
  
  await pool.query(
    `INSERT INTO users (name, hashed_password, email, pronouns) VALUES
    ('Nam2', '012345678901234567890123456789012345678901234567890123456789', 'nam@gmail.com', 'he/him')`
  );
  const result = await pool.query(
    `SELECT *
    FROM users`
  );
  res.json(result.rows);
}));

const server = app.listen(Number(PORT), HOST, () => {
  console.log(`Listening on port ${PORT} ✨`);
})

process.on('SIGINT', () => {
  server.close(() => console.log('server closing'));
})