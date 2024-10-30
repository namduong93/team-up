import { Staff } from "../../../models/user/staff/staff";
import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Staff Register Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failed case: Email Taken', async () => {
    const mockStaff: Staff = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'coach@example.com',
      password: 'testPassword',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'M',
      universityId: 1,
    };

    const result = await user_db.staffRegister(mockStaff);
    expect(result).toBe(undefined);
  })
  test('Sucess case: makes a new staff user', async () => {
    const SucessStaff: Staff = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'beepboopmeupscotty@gmail.com',
      password: 'testPassword',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'M',
      universityId: 1,
    };

    const result = await user_db.staffRegister(SucessStaff);
    expect(result).toEqual({ userId: expect.any(Number) });
  })
})