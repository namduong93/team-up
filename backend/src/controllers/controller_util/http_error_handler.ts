import { Request, Response } from "express";
import createHttpError from "http-errors";


export type HTTPFunction = (req: Request, res: Response) => Promise<void>;
export function httpErrorHandler(httpFunction: HTTPFunction) {
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