
import { UserService } from '../services/user_service';
import { UserProfileInfo } from '../models/user/user_profile_info';
import { UserIdObject, UserRepository } from '../repository/user_repository_type';
import { SessionRepository, SessionTokenObject } from '../repository/session_repository_type';
import { Student } from '../models/user/student/student';
import exp from 'constants';

describe('GET /user/profile_info', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockSessionRepository: jest.Mocked<SessionRepository>;

  beforeEach(() => {
    mockUserRepository = {
      studentRegister: jest.fn(),
      staffRegister: jest.fn(),
      userAuthenticate: jest.fn(),
      userProfileInfo: jest.fn(),
      userLogin: jest.fn(),
      userType: jest.fn(),
      studentDashInfo: jest.fn(),
      staffDashInfo: jest.fn(),
      systemAdminDashInfo: jest.fn(),
    } as jest.Mocked<UserRepository>;

    mockSessionRepository = {
      find: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<SessionRepository>;

    userService = new UserService(mockUserRepository, mockSessionRepository);
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

      const mockUserId: UserIdObject = {
        userId: 1,
      };

      const mockSessionToken = 'mockSessionToken';

      // Mocking the session repository's find method to return the userId
      mockSessionRepository.find.mockResolvedValue({
        sessionId: mockSessionToken,
        createdAt: new Date().getTime(),
        userId: mockUserId.userId,
      });

      mockUserRepository.userProfileInfo.mockResolvedValue({
        name: mockStudent.name,
        email: mockStudent.email,
        university: 'University of Melbourne', // TODO: find a way to not hardcode this
      });

      // Register the student
      mockUserRepository.studentRegister.mockResolvedValue(mockUserId);
      await userService.studentRegister(mockStudent);

      // Retrieve user profile info using the mock session token
      const result = await userService.userProfileInfo(mockUserId.userId);

      expect(result).toEqual(expect.objectContaining({
        name: 'Quan',
        email: 'hoangtungquan@gmail.com',
        university: expect.any(String), // You can also assert a specific university name if needed
      }));
    });
  });
});