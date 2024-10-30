import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import pool, { dropTestDatabase } from "../Utils/dbUtils";


describe('User Type Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Sucess case: returns user type', async () => {
    const result = await user_db.userType(1);
    expect(result).toStrictEqual({ type: 'system_admin' });
  })
})