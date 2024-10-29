import { Staff } from "../../../models/user/staff/staff";
import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";


describe('Student Register Function', () => {
  let poolean;

  const testDbName = "capstone_db"

  beforeEach(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterEach(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Failed case: returns an undefined object', async () => {
    const user_db = new SqlDbUserRepository(poolean);
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
  test('Sucess case: returns a number', async () => {
    const user_db = new SqlDbUserRepository(poolean);
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