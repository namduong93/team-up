import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";


describe('User Login Function', () => {
  let poolean;
  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Failed case: Wrong Username', async () => {
    const user_db = new SqlDbUserRepository(poolean);

    const result = await user_db.userLogin("whatdafuq@gmail.com", "passwordfail");
    expect(result).toBe(undefined);
  })
  test('Failed case: Wrong Password', async () => {
    const user_db = new SqlDbUserRepository(poolean);

    const result = await user_db.userLogin("admin@example.com", "passwordfail");
    expect(result).toBe(undefined);
  })
  test('Sucess case: returns a number', async () => {
    const user_db = new SqlDbUserRepository(poolean);

    const result = await user_db.userLogin("admin@example.com", "admin");
    expect(result).toEqual({ userId: expect.any(Number) });
  })
})