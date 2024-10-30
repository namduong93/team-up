import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import pool, { dropTestDatabase } from "../Utils/dbUtils";


describe('User Update Profile Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Sucess case: successfully changed the info of user', async () => {

    const mockStudent = {
      name: 'beep boop',
      preferredName: 'beep',
      email: 'beepbeepwobwob31@gmail.com',
      password: 'testPassword',
      gender: 'F',
      pronouns: 'He/Him',
      tshirtSize: 'S',
      universityId: 1,
      studentId: 'z1234567'
    };
    const newUserInfo = {
      name: 'beep boop',
      preferredName: 'beepbeep',
      email: 'beepbeepwobwob31@gmail.com',
      password: 'testPassword',
      gender: 'F',
      pronouns: 'She/Him',
      tshirtSize: 'L',
      universityId: 1,
      studentId: 'z1234567'
    };
    const testSubject = await user_db.studentRegister(mockStudent)
    await user_db.userUpdateProfile(testSubject.userId, newUserInfo);
    const userInfo = await user_db.userProfileInfo(testSubject.userId);
    const newTestUserInfo = {
      name: 'beep boop',
      preferredName: 'beepbeep',
      email: 'beepbeepwobwob31@gmail.com',
      affiliation: 'University of Melbourne',
      gender: 'F',
      pronouns: 'She/Him',
      tshirtSize: 'L',
      allergies: null,
      dietaryReqs: [],
      accessibilityReqs: null,
      id: testSubject.userId,
    };
    expect(userInfo).toStrictEqual(newTestUserInfo)
  })
})