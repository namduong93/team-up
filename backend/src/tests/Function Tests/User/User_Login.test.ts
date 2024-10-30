import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import pool, { dropTestDatabase } from "../Utils/dbUtils";


describe('User Login Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failed case: Wrong Username', async () => {

    const result = await user_db.userLogin("whatdafuq@gmail.com", "passwordfail");
    expect(result).toBe(undefined);
  })
  test('Failed case: Wrong Password', async () => {
    const result = await user_db.userLogin("admin@example.com", "passwordfail");
    expect(result).toBe(undefined);
  })
  test('Sucess case: returns a number', async () => {
    const result = await user_db.userLogin("admin@example.com", "admin");
    expect(result).toEqual({ userId: expect.any(Number) });
  })
})