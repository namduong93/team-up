import { Pool } from "pg";
import { SessionRepository } from "../session_repository_type.js";
import { Session } from "../../models/session/session.js";

export class SqlDbSessionRepository implements SessionRepository {
    private readonly pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async find(tk: string): Promise<Session | null> {
      const sessionQuery = `
          SELECT * FROM sessions
          WHERE token = $1;
      `;
      const sessionValues = [tk];
      const sessionResult = await this.pool.query(sessionQuery, sessionValues);
      if (sessionResult.rowCount === 0) {
          return null;
      }
      const session = sessionResult.rows[0];
      return { token: session.token, userId: session.user_id, createdAt: session.created_at };
    }

    async create(session: Session): Promise<Session | null> {
      const sessionQuery = `
          INSERT INTO sessions (token, user_id, created_at)
          VALUES ($1, $2, $3)
          RETURNING *;
      `;
      const sessionValues = [session.token, session.userId, session.createdAt];
      const sessionResult = await this.pool.query(sessionQuery, sessionValues);
      if (sessionResult.rowCount === 0) {
          return null;
      }
      const newSession = sessionResult.rows[0];
      return { token: newSession.token, userId: newSession.user_id, createdAt: newSession.created_at };
    }

    async update(session: Session): Promise<Session | null> {
        return null;
    }

    async delete(tk: string): Promise<boolean> {
        return false
    }
}