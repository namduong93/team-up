import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";


describe('User Type Function', () => {
  let poolean;
  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Sucess case: returns user type', async () => {
    const user_db = new SqlDbUserRepository(poolean);

    const result = await user_db.userType(1);
    expect(result).toStrictEqual({ type: 'system_admin' });
  })
})