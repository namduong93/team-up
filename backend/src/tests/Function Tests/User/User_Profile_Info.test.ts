import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import pool, { dropTestDatabase } from "../Utils/dbUtils";


describe('User Profile Info Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });
  test('Failed case: Unknown Id', async () => {
    const result = await user_db.userProfileInfo(69);
    expect(result).toBe(undefined);
  })
  test('Sucess case: Returns user info', async () => {
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