import express, { json, request, Request, response, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { serverAddress } from '../config/serverAddressConfig.js';
import createHttpError, { HttpError } from 'http-errors';

const { HOST, PORT } = serverAddress;
const app = express();
app.use(json());
app.use(cors());
app.use(morgan('dev'));

type HTTPFunction = (req: Request, res: Response) => Promise<void>;

function httpErrorHandler(httpFunction: HTTPFunction) {
  return async function(req: Request, res: Response) {
    // Call given function and pass on any error status code/messages
    try {
      await httpFunction(req, res);
    } catch (err: unknown) {
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
  res.json('Hi');
}));

const server = app.listen(Number(PORT), HOST, () => {
  console.log(`Listening on port ${PORT} ✨`);
})

process.on('SIGINT', () => {
  server.close(() => console.log('server closing'));
})