import { Pool } from "pg";
import { SessionRepository, SessionTokenObject } from "../session_repository_type.js";
import { Session } from "../../models/session/session.js";

export class SqlDbSessionRepository implements SessionRepository {
    private readonly pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async find(tk: string): Promise<Session | null> {
      const sessionQuery = `
          SELECT * FROM sessions
          WHERE session_id = $1;
      `;
      const sessionValues = [tk];
      const sessionResult = await this.pool.query(sessionQuery, sessionValues);
      if (sessionResult.rowCount === 0) {
          return null;
      }
      const session = sessionResult.rows[0];
      return { sessionId: session.session_id, userId: session.user_id, createdAt: session.created_at };
    }

    async create(session: Session): Promise<SessionTokenObject | null> {
      const sessionQuery = `
          INSERT INTO sessions (session_id, user_id, created_at)
          VALUES ($1, $2, to_timestamp($3))
          RETURNING *;
      `;
      const sessionValues = [session.sessionId, session.userId, session.createdAt];
      const sessionResult = await this.pool.query(sessionQuery, sessionValues);
      if (sessionResult.rowCount === 0) {
          return null;
      }
      const newSession = sessionResult.rows[0];
      return { sessionId: newSession.token };
    }

    async update(session: Session): Promise<Session | null> {
        return null;
    }

    //TODO: Delete every outdated session
    async delete(tk: string): Promise<boolean> {
        return false
    }
}