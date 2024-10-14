import { UserService } from '../../services/user_service';
import { UserType } from '../../models/user/user';
import { SqlDbUserRepository } from '../../repository/user/sqldb';
import pool, { getUserIdFromSessionId } from '../test_util/test_utilities';
import { SqlDbSessionRepository } from '../../repository/session/sqldb';
import { SessionTokenObject } from '../../repository/session_repository_type';

describe('GET /user/type', () => {
  let userService: UserService;

  beforeAll(async () => {
    // Initialize the UserService with real repositories that connect to the test database
    userService = new UserService(new SqlDbUserRepository(pool), new SqlDbSessionRepository(pool));
  });

  afterAll(() => {
    // Clean up and close the database connection
    pool.end();
  });

  describe('successful cases', () => {
    test('admin success', async () => {
      const mockAdmin = {
        email: 'admin@example.com',
        password: 'admin',
      };

      const sessionToken: SessionTokenObject = await userService.userLogin(mockAdmin.email, mockAdmin.password);
      const userId: number = await getUserIdFromSessionId(sessionToken.sessionId);

      const result = await userService.userType(userId);

      expect(result).toEqual(expect.objectContaining({
        type: UserType.SYSTEM_ADMIN,
      }));
    });

    test('staff success', async () => {
      const mockStaff = {
        email: 'teststaff@examplecom',
        password: 'pleasechange',
      };

      const sessionToken: SessionTokenObject = await userService.userLogin(mockStaff.email, mockStaff.password);
      const userId: number = await getUserIdFromSessionId(sessionToken.sessionId);

      const result = await userService.userType(userId);

      expect(result).toEqual(expect.objectContaining({
        type: UserType.STAFF,
      }));
    });

    test('student success', async () => {
      const mockStaff = {
        email: 'teststudent@examplecom',
        password: 'pleasechange',
      };

      const sessionToken: SessionTokenObject = await userService.userLogin(mockStaff.email, mockStaff.password);
      const userId: number = await getUserIdFromSessionId(sessionToken.sessionId);

      const result = await userService.userType(userId);

      expect(result).toEqual(expect.objectContaining({
        type: UserType.STUDENT,
      }));
    });
  })

  // describe('failing cases', () => {
  //   test('missing name', async () => {
  //   });
  // })
});
