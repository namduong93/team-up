import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";


describe('User Profile Info Function', () => {
  let poolean;
  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Failed case: Unknown Id', async () => {
    const user_db = new SqlDbUserRepository(poolean);

    const result = await user_db.userProfileInfo(69);
    expect(result).toBe(undefined);
  })
  test('Sucess case: Returns Info', async () => {
    const user_db = new SqlDbUserRepository(poolean);

    const result = await user_db.userProfileInfo(1);
    expect(result).toStrictEqual({
      id: 1,
      name: 'System Admin',
      preferredName: 'Admin',
      email: 'admin@example.com',
      affiliation: 'University of Melbourne',
      gender: 'M',
      pronouns: 'he/him',
      tshirtSize: 'L',
      allergies: 'Peanuts',
      dietaryReqs: [],
      accessibilityReqs: 'None'
    })
  })
})