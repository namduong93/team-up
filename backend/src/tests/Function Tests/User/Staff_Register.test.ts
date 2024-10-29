import { Staff } from "../../../models/user/staff/staff";
import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";


describe('Staff Register Function', () => {
  let poolean;

  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Failed case: Email Taken', async () => {
    const user_db = new SqlDbUserRepository(poolean);
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
    const user_db = new SqlDbUserRepository(poolean);
    const mockStaff: Staff = {
      name: 'Maximillian Maverick',
      preferredName: 'X',
      email: 'beepboopmeupscotty@gmail.com',
      password: 'testPassword',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'M',
      universityId: 1,
    };

    const result = await user_db.staffRegister(mockStaff);
    expect(result).toEqual({ userId: expect.any(Number) });
  })
})