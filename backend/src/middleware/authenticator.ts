import pkg from 'pg';
import type {NextFunction, Request, Response} from "express";
import { EXPIRED_TOKEN, INVALID_TOKEN, TOKEN_NOT_FOUND } from "../controllers/controller_util/http_error_handler.js";
import { SqlDbSessionRepository } from "../repository/session/sqldb.js";
import { sessionExpirationTime } from "../models/session/session.js";
import { dbConfig } from "../../config/dbConfig.js";

const ignoredRoutes = new Map();
ignoredRoutes.set("/student/register", "POST");
ignoredRoutes.set("/staff/register", "POST");
ignoredRoutes.set("/user/login", "POST");

const { Pool } = pkg;
const pool = new Pool({
  user: dbConfig.DB_USER,
  host: dbConfig.DB_HOST,
  database: dbConfig.DB_NAME,
  password: dbConfig.DB_PASSWORD,
  port: Number(dbConfig.DB_PORT),
  max: 10,
});


export class Authenticator {
  static extractTokenFromHeader(req: Request) {
    // Doc: https://swagger.io/docs/specification/v3_0/authentication/bearer-authentication/
    const AUTHORIZATION_HEADER: string = "Authorization";
    const AUTH_HEADER_PREFIX: string = "Bearer";
    const authorizationHeader = req.header(AUTHORIZATION_HEADER);

    if (!authorizationHeader || !authorizationHeader.startsWith(AUTH_HEADER_PREFIX)) {
      throw TOKEN_NOT_FOUND;
    }
    return authorizationHeader.substring(7, authorizationHeader.length);
  }

  async authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      // Checking if the route is in the ignored list
      if (ignoredRoutes.has(req.url) && ignoredRoutes.get(req.url) === req.method) {
          next();
          return;
      }

      const token = Authenticator.extractTokenFromHeader(req);
      if (!token) {
        throw TOKEN_NOT_FOUND;
      }

      // Instead, we check with our sessions table
      let sessionRepository = new SqlDbSessionRepository(pool);
      let session = await sessionRepository.find(token);

      // Check if session exists
      if (!session) {
        throw INVALID_TOKEN;
      }

      let expiresAt = session.createdAt + sessionExpirationTime;
      if (expiresAt < Math.floor(Date.now() / 1000)) {
        throw EXPIRED_TOKEN;
      }

      // Passing uuid to the next middleware
      res.locals.id = session.userId;
      next();

    } catch (err: any) {
      next(err);
    }
  }
}
