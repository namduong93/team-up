import { Session } from "../models/session/session.js";

export type SessionTokenObject = { sessionToken: string };
// This is the repository layer. It is responsible for handling database operations.
export interface SessionRepository {
    find(tk: string): Promise<Session | null>;
    create(session: Session): Promise<SessionTokenObject | null>;
    update(session: Session): Promise<Session | null>;
    delete(tk: string): Promise<boolean>;
}