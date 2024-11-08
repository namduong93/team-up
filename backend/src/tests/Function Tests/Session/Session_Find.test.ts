import { SqlDbSessionRepository } from "../../../repository/session/sqldb";

import pool, { dropTestDatabase } from "../Utils/dbUtils"

// need session create
describe.skip('Session Find Function', () => {
  let session_db;

  beforeAll(async () => {
    session_db = new SqlDbSessionRepository(pool)
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('husk', () => {
    expect(1 + 1).toBe(2);
  })
})