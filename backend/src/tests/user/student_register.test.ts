import { UserService } from '../../services/user_service';
import { Student } from '../../models/user/student/student';
import pool, { deleteUserRecords } from '../test_util/test_utilities'
import HttpError from "http-errors";
import { SqlDbUserRepository } from '../../repository/user/sqldb';
import { SqlDbSessionRepository } from '../../repository/session/sqldb';

describe('POST /student/register', () => {
  let userService: UserService;

  beforeAll(async () => {
    // Initialize the UserService with a real repository that connects to the test database
    userService = new UserService(new SqlDbUserRepository(pool), new SqlDbSessionRepository(pool));
  });

  beforeEach(async () => {
    deleteUserRecords();
  });

  afterAll(async () => {
    // Clean up and close the database connection
    await pool.end();
  });

  describe('successful cases', () => {
    test('success', async () => {
      const mockStudent: Student = {
        name: 'Quan',
        email: 'hoangtungquan@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
        studentId: 'z5296486'
      };

      const result = await userService.studentRegister(mockStudent);
      expect(result).toHaveProperty('sessionId'); // Adjust according to your returned structure
    });
  })

  describe('failing cases', () => {
    test('missing name', async () => {
      const newStudent: Student = {
        name: '',
        email: 'hoangtungquan1@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
        studentId: 'z5296486'
      };

      await expect(userService.studentRegister(newStudent)).rejects.toThrow(HttpError.HttpError);
    });

    test('missing email', async () => {
      const newStudent: Student = {
        name: 'Quan',
        email: '',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
        studentId: 'z5296486'
      };

      await expect(userService.studentRegister(newStudent)).rejects.toThrow(HttpError.HttpError);
    });

    test('missing password', async () => {
      const newStudent: Student = {
        name: 'Quan',
        email: 'hoangtungquan2@gmail.com',
        password: '',
        tshirtSize: 'M',
        universityId: 1,
        studentId: 'z5296486'
      };

      await expect(userService.studentRegister(newStudent)).rejects.toThrow(HttpError.HttpError);
    });

    test('missing t-shirt size', async () => {
      const newStudent: Student = {
        name: 'Quan',
        email: 'hoangtungquan3@gmail.com',
        password: 'testPassword',
        tshirtSize: '',
        universityId: 1,
        studentId: 'z5296486'
      };
      
      await expect(userService.studentRegister(newStudent)).rejects.toThrow(HttpError.HttpError);
    });

    test('duplicated email', async () => {
      const mockStudent1: Student = {
        name: 'Quan',
        email: 'hoangtungquan4@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
        studentId: 'z5296486'
      };

      const mockStudent2: Student = {
        name: 'Not Quan',
        email: 'hoangtungquan4@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
        studentId: 'z5296486'
      };

      await userService.studentRegister(mockStudent1);

      await expect(userService.studentRegister(mockStudent2)).rejects.toThrow(HttpError.HttpError);
    });
  })
});
