import { UserService } from '../../services/user_service';
import { UserIdObject, UserRepository } from '../../repository/user_repository_type';
import { Student } from '../../models/user/student/student';
import { SessionRepository, SessionTokenObject } from '../../repository/session_repository_type';
import { v4 as uuidv4 } from 'uuid';
import HttpError from "http-errors";
import { Staff } from '../../models/user/staff/staff';
import { SqlDbUserRepository } from '../../repository/user/sqldb';
import pool from '../test_util/test_utilities';
import { SqlDbSessionRepository } from '../../repository/session/sqldb';
import e from 'express';

describe('POST /user/login and POST /user/logout', () => {
  let userService: UserService;

  beforeAll(async () => {
    // Initialize the UserService with a real repository that connects to the test database
    userService = new UserService(new SqlDbUserRepository(pool), new SqlDbSessionRepository(pool));
  });


  afterAll(async () => {
    // Clean up and close the database connection
    await pool.end();
  });

  describe('successful cases', () => {
    test('login/logout success', async () => {
      // Log the user in
      const sessionToken = await userService.userLogin('admin@example.com', 'admin');
      expect(sessionToken).toHaveProperty('sessionId');

      // Now log the user out
      const newSessionToken = await userService.userLogout(sessionToken.sessionId);
      expect(newSessionToken).toBeUndefined();
    });
  });

  describe('failing cases', () => {
    test('login with undefined email', async () => {
      await expect(userService.userLogin(undefined, 'admin'))
        .rejects
        .toThrow(HttpError.BadRequest('Email is required'));
    });

    test('login with empty password', async () => {
      await expect(userService.userLogin('admin@example.com', ''))
        .rejects
        .toThrow(HttpError.BadRequest('Password is required'));
    });

    test('login with non-matching credentials', async () => {
      await expect(userService.userLogin('admin@example.com', 'wrongPassword'))
        .rejects
        .toThrow(HttpError.Unauthorized('Invalid email or password'));
    });
  });
});
