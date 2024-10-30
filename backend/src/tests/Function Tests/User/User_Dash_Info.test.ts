import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('User Dash Info Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Sucess case: Returns user dash info', async () => {
    const result = await user_db.userDashInfo(1);
    expect(result).toStrictEqual({ preferredName: 'Admin', affiliation: 'University of Melbourne' })
  })
})