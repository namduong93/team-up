import { UserService } from '../../services/user_service';
import { Student } from '../../models/user/student/student';
import { SessionTokenObject } from '../../repository/session_repository_type';
import { SqlDbUserRepository } from '../../repository/user/sqldb';
import { SqlDbSessionRepository } from '../../repository/session/sqldb';
import pool, { getUserIdFromSessionId } from '../test_util/test_utilities';

describe('GET /user/profile_info', () => {
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
    test('student success', async () => {
      const mockStudent: Student = {
        name: 'test student profile',
        email: 'teststudentprofileinfo@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
        studentId: 'z5296486'
      };

      const sessionToken: SessionTokenObject = await userService.studentRegister(mockStudent);
      const userId: number = await getUserIdFromSessionId(sessionToken.sessionId);

      // Retrieve user profile info using the userId
      const result = await userService.userProfileInfo(userId);

      expect(result).toEqual(expect.objectContaining({
        name: 'test student profile',
        email: 'teststudentprofileinfo@gmailcom',
        university: 'University of Melbourne'
      }));
    });

    test('staff success', async () => {
      const mockStaff = {
        name: 'test staff profile',
        email: 'teststaffprofileinfo@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 2,
      };

      const sessionToken: SessionTokenObject = await userService.staffRegister(mockStaff);
      const userId: number = await getUserIdFromSessionId(sessionToken.sessionId);

      // Retrieve user profile info using the userId
      const result = await userService.userProfileInfo(userId);

      expect(result).toEqual(expect.objectContaining({
        name: 'test staff profile',
        email: 'teststaffprofileinfo@gmailcom',
        university: 'Monash University'
      }));
    });
  });
});
