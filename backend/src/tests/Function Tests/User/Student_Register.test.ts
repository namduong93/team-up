import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import pool, { dropTestDatabase } from "../Utils/dbUtils";


describe('Student Register Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failed case: Email Taken', async () => {
    const mockStudent = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'admin@example.com',
      password: 'testPassword',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'L',
      universityId: 1,
      studentId: 'z5381412'
    };

    const result = await user_db.studentRegister(mockStudent);
    expect(result).toBe(undefined);
  })
  test('Sucess case: new student user made', async () => {
    const mockStudent = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'maximillianmaxi31@gmail.com',
      password: 'testPassword',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'L',
      universityId: 1,
      studentId: 'z5381412'
    };

    const result = await user_db.studentRegister(mockStudent);
    expect(result).toEqual({ userId: expect.any(Number) });
  })
})