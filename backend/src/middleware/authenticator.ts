import type {NextFunction, Request, Response} from "express";
import { EXPIRED_TOKEN, INVALID_TOKEN, TOKEN_NOT_FOUND } from "../controllers/controller_util/http_error_handler.js";
import { sessionExpirationTime } from "../models/session/session.js";
import { SessionRepository } from '../repository/session_repository_type.js';

const ignoredRoutes = new Map();
ignoredRoutes.set("/student/register", "POST");
ignoredRoutes.set("/staff/register", "POST");
ignoredRoutes.set("/user/login", "POST");
// ignoredRoutes.set("/universities/list", "GET");


export class Authenticator {

  authenticationMiddleware(sessionRepository: SessionRepository) {
    return async function(req: Request, res: Response, next: NextFunction) {
      try {
        // Checking if the route is in the ignored list
        if (ignoredRoutes.has(req.url) && ignoredRoutes.get(req.url) === req.method) {
            next();
            return;
        }

        const reqSessionId = req.cookies.sessionId;
        if (!reqSessionId) {
          throw TOKEN_NOT_FOUND;
        }

        // Find the session in the database
        let session = await sessionRepository.find(reqSessionId);
        if (!session) {
          throw INVALID_TOKEN;
        }

        let expiresAt = session.createdAt + sessionExpirationTime;
        if (expiresAt < Math.floor(Date.now() / 1000)) {
          throw EXPIRED_TOKEN;
        }

        // Passing uuid to the next middleware
        req.query.userId = `${session.userId}`;
        next();

      } catch (err: any) {
        next(err);
      }
    }
  }
}
