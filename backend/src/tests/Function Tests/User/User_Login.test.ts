import { Student } from "../../../models/user/student/student";
import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import pool, { dropTestDatabase } from "../Utils/dbUtils";


describe('User Login Function', () => {
  let user_db;

  const mockUser: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'OwOwhudis@OwO.com',
    password: 'ezpass',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'L',
    universityId: 1,
    studentId: 'z5381412'
  };

  let user;

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
    user = await user_db.studentRegister(mockUser);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failed case: Wrong Username', async () => {
    const result = await user_db.userLogin("whatdafuq@gmail.com", "ezpass");
    expect(result).toBe(undefined);
  })
  test('Failed case: Wrong Password', async () => {
    const result = await user_db.userLogin("OwOwhudis@OwO.com", "passwordfail");
    expect(result).toBe(undefined);
  })
  test('Sucess case: returns a number', async () => {
    const result = await user_db.userLogin("OwOwhudis@OwO.com", "ezpass");
    expect(result).toEqual({ userId: user.userId });
  })
})