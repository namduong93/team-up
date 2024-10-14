import { UserService } from '../../services/user_service';
import { Staff } from '../../models/user/staff/staff';
import pool from '../test_util/test_utilities';
import HttpError from "http-errors";
import { SqlDbUserRepository } from '../../repository/user/sqldb';
import { SqlDbSessionRepository } from '../../repository/session/sqldb';

describe('POST /staff/register', () => {
  let userService: UserService;

  beforeAll(async () => {
    // Initialize the UserService with a real repository that connects to the test database
    userService = new UserService(new SqlDbUserRepository(pool), new SqlDbSessionRepository(pool));
  });

  afterAll(() => {
    // Clean up and close the database connection
    pool.end();
  });

  describe('successful cases', () => {
    test('success', async () => {
      const mockStaff: Staff = {
        name: 'Quan',
        email: 'tungquanhoang@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
      };

      const result = await userService.staffRegister(mockStaff);
      expect(result).toHaveProperty('sessionId'); // Adjust according to your returned structure
    });
  });

  describe('failing cases', () => {
    test('missing name', async () => {
      const newStaff: Staff = {
        name: '',
        email: 'tungquanhoang1@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
      };

      await expect(userService.staffRegister(newStaff)).rejects.toThrow(HttpError.HttpError);
    });

    test('missing email', async () => {
      const newStaff: Staff = {
        name: 'Quan',
        email: '',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
      };

      await expect(userService.staffRegister(newStaff)).rejects.toThrow(HttpError.HttpError);
    });

    test('missing password', async () => {
      const newStaff: Staff = {
        name: 'Quan',
        email: 'tungquanhoang2@gmail.com',
        password: '',
        tshirtSize: 'M',
        universityId: 1,
      };

      await expect(userService.staffRegister(newStaff)).rejects.toThrow(HttpError.HttpError);
    });

    test('missing t-shirt size', async () => {
      const newStaff: Staff = {
        name: 'Quan',
        email: 'tungquanhoang3@gmail.com',
        password: 'testPassword',
        tshirtSize: '',
        universityId: 1,
      };

      await expect(userService.staffRegister(newStaff)).rejects.toThrow(HttpError.HttpError);
    });

    test('duplicated email', async () => {
      const mockStaff1: Staff = {
        name: 'Quan',
        email: 'tungquanhoang4@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
      };

      const mockStaff2: Staff = {
        name: 'Not Quan',
        email: 'tungquanhoang4@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
      };

      // Register the first staff
      await userService.staffRegister(mockStaff1);

      // Attempt to register the second staff with the same email
      await expect(userService.staffRegister(mockStaff2)).rejects.toThrow(HttpError.HttpError);
    });
  });
});
