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

  test('Sucess case: successfully changed the info of user', async () => {
    const user_db = new SqlDbUserRepository(poolean);

    const newUserInfo = {
      name: 'System Admin;',
      preferredName: 'A',
      email: 'admin@example.com',
      affiliation: 'University of Melbourne',
      gender: 'M',
      pronouns: 'he/Him',
      tshirtSize: 'L',
      allergies: 'Peanuts',
      dietaryReqs: [],
      accessibilityReqs: 'None',
    };

    await user_db.userUpdateProfile(1, newUserInfo);
    const userInfo = await user_db.userProfileInfo(1);
    const newTestUserInfo = {
      name: 'System Admin;',
      preferredName: 'A',
      email: 'admin@example.com',
      affiliation: 'University of Melbourne',
      gender: 'M',
      pronouns: 'he/Him',
      tshirtSize: 'L',
      allergies: 'Peanuts',
      dietaryReqs: [],
      accessibilityReqs: 'None',
      id: 1,
    };
    expect(userInfo).toStrictEqual(newTestUserInfo)
  })
})