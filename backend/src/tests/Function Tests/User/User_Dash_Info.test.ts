import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";


describe('User Update Profile Function', () => {
  let poolean;
  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Sucess case: Returns Info', async () => {
    const user_db = new SqlDbUserRepository(poolean);

    const result = await user_db.userDashInfo(1);
    expect(result).toStrictEqual({ preferredName: 'Admin', affiliation: 'University of Melbourne' })
  })
})